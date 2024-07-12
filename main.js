const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const {Workbook} = require('exceljs')

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const bucketName = process.env.GCP_BUCKET_NAME;

// Using service account
const serviceAccountPath = 'gcp_cred.json';
const storage = new Storage({
  keyFilename: serviceAccountPath,
});

//using default creds
// const storage = new Storage()

// Create a storage bucket reference
const bucket = storage.bucket(bucketName);

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // Limit file size to 100MB
  },
});

// Create a single MongoDB client instance
let mongoClient;

async function main() {
  mongoClient = new MongoClient(uri);

  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');

    const database = mongoClient.db('ad_classification');
    const collection = database.collection('analysis_results');

    await database.listCollections().toArray((err, names) => {
      if (!err) {
        console.log(names);
      }
    });

    // Fetch all records from the collection
    app.get('/records', async (req, res) => {
      try {
        const records = await collection.find({}).toArray();
        res.json(records);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: error.message });
      }
    });

    app.get('/getSignedUrl/:filename', async (req, res) => {
      try {
        const filename = req.params.filename;
        // const [url] = await bucket
        //   .file(filename)
        //   .getSignedUrl({
        //     action: 'read',
        //     expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        //   });
        // res.status(200).json({ filename, signedUrl: url });

        res.status(200).json({ filename, signedUrl: `https://storage.cloud.google.com/${bucketName}/${filename}` });
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: error.message });
      }
    })
    // Upload endpoint
    app.post('/upload', upload.single('video'), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const filename = req.file.originalname
        let finalFilename = filename;

        // Check if the file already exists in the bucket
        let [exists] = await bucket.file(filename).exists();

        // Add a numeric suffix if the file exists
        let suffix = 1;
        while (exists) {
          let parts = filename.split('.');
          const extension = parts.pop();
          finalFilename = `${parts.join('.')}-${suffix}.${extension}`;
          [exists] = await bucket.file(finalFilename).exists();
          suffix++;
        }
        
        const blob = bucket.file(finalFilename);
        const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: req.file.mimetype,
        });

        blobStream.on('error', (err) => {
          console.error('Blob stream error:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        });

        blobStream.on('finish', async () => {
          try {
            console.log('Successfully Uploaded..')
            res.status(200).json({filename,success:true});
          } catch (error) {
            console.error('Error sending response:', error);
            res.status(500).json({ error: error.message });
          }
        });

        blobStream.end(req.file.buffer);
      } catch (error) {
        console.error('Error sending response:', error);
        res.status(500).json({ error: error.message });
      }
    });


    app.post('/export-excel', async (req, res) => {
      try {
        const { recordIds = [] } = req.body; // Allow filtering by record IDs (optional)
        console.log(recordIds)
        
        const ids = recordIds.map(id=>new ObjectId(id));
        const query  = {_id:{$in:ids}
      }
        let records;
    
        if (recordIds.length > 0) {
          // Fetch specific records based on IDs
          records = await collection.find(query).toArray();
        } else {
          // Fetch all records (default behavior)
          records = await collection.find({}).toArray();
        }
    
        if (!records || records.length === 0) {
          return res.status(404).json({ error: 'No records found' });
        }
    
        // Create a new Excel workbook
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Records');
    
        // Write headers
        const headers = Object.keys(records[0]); // Extract headers from the first record
        worksheet.addRow(headers);
    
        // Write data rows
        records.forEach(record => {
          worksheet.addRow(Object.values(record));
        });
    
        // Generate Excel file in memory
        const buffer = await workbook.xlsx.writeBuffer();
    
    
        // Return the Excel file content as a download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=records.xlsx');
        res.send(buffer);
      } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    app.post('/export-excel', async (req, res) => {
      try {
        const { recordIds = [] } = req.body; // filtering by record IDs
        
        const ids = recordIds.map(id=>new ObjectId(id));
        const query  = {_id:{$in:ids}
      }
        let records;
    
        if (recordIds.length > 0) {
          // Fetch specific records based on IDs
          records = await collection.find(query).toArray();
        } else {
          // Fetch all records
          records = await collection.find({}).toArray();
        }
    
        if (!records || records.length === 0) {
          return res.status(404).json({ error: 'No records found' });
        }
    
        // Create a new Excel workbook
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Records');
    
        // Write headers
        const headers = Object.keys(records[0]); // Extract headers from the first record
        worksheet.addRow(headers);
    
        // Write data rows
        records.forEach(record => {
          worksheet.addRow(Object.values(record));
        });
    
        // Generate Excel file in memory
        const buffer = await workbook.xlsx.writeBuffer();
    
    
        // Return the Excel file content as a download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=records.xlsx');
        res.send(buffer);
      } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process on error
  }
}

main().catch(console.error);


process.on('SIGINT', async () => {
  if (mongoClient) {
    await mongoClient.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
