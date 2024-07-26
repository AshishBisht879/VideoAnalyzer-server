const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const URL = require('url');

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
let collection = null

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
    try{
    await mongoClient.connect();
    console.log('Connected to MongoDB');

    const database = mongoClient.db('ad_classification');
    collection = database.collection('analysis_results_v5');


  //   await database.collection("analysis_results_v7").drop(function(err, delOK) {
  //   if (err) throw err;
  //   if (delOK) console.log("Collection deleted");
  // });

    await database.listCollections().toArray((err, names) => {
      if (!err) {
        console.log(names);
      }
    });

    // await mongoClient.close();
  }
  catch(er){
    console.log(er.message)
  }

    // Fetch all records from the collection
    app.get('/records', async (req, res) => {
      try {
        const records = await collection.find({}).toArray();
        res.json(records);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: error.message });
      }
      const Object1 = [
        {
          "video_info":{"width":456,"height":300,"fps":30},
          "_id": "666814e2bd3659ecbbbb09b7",
          "start_time": 1719301952.3570385,
          "end_time": 1719301991.3389843,
          "video_path": "ad_classify_trigger/cocacola_ad-2.mp4",
          "status": 1,
          "filename": "output-cocacola_ad-2.mp4-1718097119.2899482.json",
          "brands_audio": {
            "entities": [
              "Coca-Cola",
              "Coca Cola",
              "Coca-Cola",
              "Coca Cola"
            ],
            "categories": [
              "Beverage",
              "Beverage"
            ],
            "speech_transcript": "What is Coca-Cola is it an excuse to get together since 1886 Coca-Cola has been passing on smiles from generation to generation. We've been giving kids scholarships like the early birds and the all-nighters and you get to enjoy what matters most Coca Cola drink up.",
            "comprehend_results": [
              "Coca-Cola",
              "Coca Cola"
            ],
            "gemini_results": [
              "Coca-Cola",
              "Coca Cola"
            ]
          },
          "brands_video_gcp": {
            "McDonald's": 0.94503272,
            "Citroën": 0.93972242
          },
          "final_logos": {
            "McDonald's": 0.94503272,
            "Citroën": 0.93972242
          },
          "iab_category": {
            "category": [
              "Food & Drink",
              "Television",
              "Business and Finance"
            ]
          },
          "labels": {
            "mentos": 0.39379385,
            "bottle": 0.49894339,
            "soft drink": 0.61748743,
            "diet coke and mentos eruption": 0.32236513,
            "coca cola": 0.99199897,
            "drink": 0.81978738,
            "cola": 0.80782765,
            "television advertisement": 0.92622828
          }
        },
        {
          "_id": "6668159ebd3659ecbbbb09b9",
          "video_path": "ad_classify_trigger/hydrogen-1.mp4",
          "status": 0,
          "filename": "output-hydrogen-1.mp4-1718097306.9002385.json"
        },
        {
          "_id": "666817e28ba6b29955960b8e",
          "brands_video_gcp": {
      
          },
          "brands_audio": {
            "entities": [
              "Hydrogen"
            ],
            "categories": [
              "Financial Services"
            ],
            "speech_transcript": "You are tired of banks making money off your company's hard work. So you decide why not create my own branded Financial products, but you learn that only huge companies can afford it and get through the complicated setup. Thankfully there's hydrogen free to start and fast to set up with our easy-to-use no code interface Point click done be your own bank and watch your earnings grow get started today for free at hydrogen platform.com",
            "comprehend_results": [],
            "gemini_results": [
              "Hydrogen"
            ]
          },
          "labels": {
            "text": 0.43353447,
            "logo": 0.46609038,
            "font": 0.30822152,
            "diagram": 0.40332291
          },
          "final_logos": {
      
          },
          "iab_category": {
            "category": []
          },
          "status": 1,
          "filename": "output-hydrogen.mp4-1718084125.8314025.json"
        },
        {
          "_id": "666819debea04843d486bb79",
          "video_path": "ad_classify_trigger/googlepixel6-1.mp4",
          "status": 1,
          "filename": "output-googlepixel6-1.mp4-1718098394.4777138.json",
          "brands_audio": {
            "entities": [],
            "categories": []
          },
          "brands_video_gcp": {
            "Google": 0.92130274
          },
          "final_logos": {
            "Google": 0.92130274
          },
          "iab_category": {
            "category": [
              "Technology & Computing"
            ]
          },
          "labels": {
            "logo": 0.35979313,
            "mobile device": 0.40358233
          }
        },
        {
          "_id": "66681cd26a14b9bdb14c78f2",
          "video_path": "ad_classify_trigger/Nissan-1.mp4",
          "status": 1,
          "filename": "output-Nissan-1.mp4-1718099150.5264225.json",
          "brands_audio": {
            "entities": [
              "Misun"
            ],
            "categories": [
              "Unknown"
            ],
            "speech_transcript": "Isn't it great when passion ignites performance ignite the excitement misun?",
            "comprehend_results": [],
            "gemini_results": [
              "Misun"
            ]
          },
          "brands_video_gcp": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "final_logos": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "iab_category": {
            "category": [
              "Automotive"
            ]
          },
          "labels": {
            "soccer": 0.62544113,
            "player": 0.65759712,
            "team sport": 0.30484191,
            "sports": 0.77019072,
            "land vehicle": 0.59040409,
            "nissan": 0.45152983,
            "ball game": 0.36392882,
            "motor vehicle": 0.67802572,
            "vehicle": 0.862993,
            "car": 0.56654763
          }
        },
        {
          "_id": "66681f098c314182f5576ef5",
          "video_path": "ad_classify_trigger/pizza-1.mp4",
          "status": 1,
          "filename": "output-pizza-1.mp4-1718099718.3133876.json",
          "brands_audio": {
            "entities": [
              "Pizza Hut",
              "Pizza Hut"
            ],
            "categories": [
              "Restaurant"
            ],
            "speech_transcript": "I remember when I was a kid Smiles came from the simplest things sometimes Smiles came from being around family. Other times Smiles came from listening to our favorite Tunes or even from The Cheeky moments we had and how can I forget the smile? On my special day, but as time goes by Smiles can be hard to come by all I needed. With a little reminder to make me smile again the warmest Smiles come from a special place a place. That's always close to my heart. Thanks Pizza Hut for 35 years of smiles",
            "comprehend_results": [
              "Pizza Hut"
            ],
            "gemini_results": [
              "Pizza Hut"
            ]
          },
          "brands_video_gcp": {
            "Pizza Hut": 0.95025909
          },
          "final_logos": {
            "Pizza Hut": 0.95025909
          },
          "iab_category": {
            "category": [
              "Travel",
              "Food & Drink",
              "Events and Attractions"
            ]
          },
          "labels": {
            "room": 0.74342102,
            "people": 0.46747264,
            "song": 0.61138678,
            "facial expression": 0.33662048
          }
        },
        {
          "_id": "666862d32af7cfc1aa7f084c",
          "video_path": "ad_classify_trigger/Nissan-1-1.mp4",
          "status": 1,
          "filename": "output-Nissan-1-1.mp4-1718117072.0961936.json",
          "brands_audio": {
            "entities": [
              "Misun"
            ],
            "categories": [
              "Product"
            ],
            "speech_transcript": "Isn't it great when passion ignites performance ignite the excitement misun?",
            "comprehend_results": [],
            "gemini_results": [
              "Misun"
            ]
          },
          "brands_video_gcp": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "final_logos": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "iab_category": {
            "category": [
              "Automotive"
            ]
          },
          "labels": {
            "player": 0.65759712,
            "team sport": 0.30484191,
            "nissan": 0.45152983,
            "sports": 0.77019072,
            "land vehicle": 0.59040409,
            "soccer": 0.62544113,
            "ball game": 0.36392882,
            "motor vehicle": 0.67802572,
            "vehicle": 0.862993,
            "car": 0.56654769
          }
        },
        {
          "_id": "6668750e43fc2cf47e42ade3",
          "video_path": "ad_classify_trigger/Nissan-1-2.mp4",
          "status": 1,
          "filename": "output-Nissan-1-2.mp4-1718121738.5388281.json",
          "brands_audio": {
            "entities": [
              "Misun"
            ],
            "categories": [
              "Unknown"
            ],
            "speech_transcript": "Isn't it great when passion ignites performance ignite the excitement misun?",
            "comprehend_results": [],
            "gemini_results": [
              "Misun"
            ]
          },
          "brands_video_gcp": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "final_logos": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "iab_category": {
            "category": [
              "Automotive"
            ]
          },
          "labels": {
            "nissan": 0.45152983,
            "team sport": 0.30484191,
            "soccer": 0.62544113,
            "sports": 0.77019072,
            "land vehicle": 0.59040409,
            "player": 0.65759712,
            "ball game": 0.36392882,
            "motor vehicle": 0.67802572,
            "vehicle": 0.862993,
            "car": 0.56654763
          }
        }
      ]
      const Object2 = [
        {
          "_id": "666814e2bd3659ecbbbb09b7",
          "video_path": "ad_classify_trigger/cocacola_ad-2.mp4",
          "status": 0,
          "filename": "output-cocacola_ad-2.mp4-1718097119.2899482.json",
          "brands_audio": {
            "entities": [
              "Coca-Cola",
              "Coca Cola",
              "Coca-Cola",
              "Coca Cola"
            ],
            "categories": [
              "Beverage",
              "Beverage"
            ],
            "speech_transcript": "What is Coca-Cola is it an excuse to get together since 1886 Coca-Cola has been passing on smiles from generation to generation. We've been giving kids scholarships like the early birds and the all-nighters and you get to enjoy what matters most Coca Cola drink up.",
            "comprehend_results": [
              "Coca-Cola",
              "Coca Cola"
            ],
            "gemini_results": [
              "Coca-Cola",
              "Coca Cola"
            ]
          },
          "brands_video_gcp": {
            "McDonald's": 0.94503272,
            "Citroën": 0.93972242
          },
          "final_logos": {
            "McDonald's": 0.94503272,
            "Citroën": 0.93972242
          },
          "iab_category": {
            "category": [
              "Food & Drink",
              "Television",
              "Business and Finance"
            ]
          },
          "labels": {
            "mentos": 0.39379385,
            "bottle": 0.49894339,
            "soft drink": 0.61748743,
            "diet coke and mentos eruption": 0.32236513,
            "coca cola": 0.99199897,
            "drink": 0.81978738,
            "cola": 0.80782765,
            "television advertisement": 0.92622828
          }
        },
        {
          "_id": "6668159ebd3659ecbbbb09b9",
          "video_path": "ad_classify_trigger/hydrogen-1.mp4",
          "status": 0,
          "filename": "output-hydrogen-1.mp4-1718097306.9002385.json"
        },
        {
          "_id": "666817e28ba6b29955960b8e",
          "brands_video_gcp": {
      
          },
          "brands_audio": {
            "entities": [
              "Hydrogen"
            ],
            "categories": [
              "Financial Services"
            ],
            "speech_transcript": "You are tired of banks making money off your company's hard work. So you decide why not create my own branded Financial products, but you learn that only huge companies can afford it and get through the complicated setup. Thankfully there's hydrogen free to start and fast to set up with our easy-to-use no code interface Point click done be your own bank and watch your earnings grow get started today for free at hydrogen platform.com",
            "comprehend_results": [],
            "gemini_results": [
              "Hydrogen"
            ]
          },
          "labels": {
            "text": 0.43353447,
            "logo": 0.46609038,
            "font": 0.30822152,
            "diagram": 0.40332291
          },
          "final_logos": {
      
          },
          "iab_category": {
            "category": []
          },
          "status": 1,
          "filename": "output-hydrogen.mp4-1718084125.8314025.json"
        },
        {
          "_id": "666819debea04843d486bb79",
          "video_path": "ad_classify_trigger/googlepixel6-1.mp4",
          "status": 1,
          "filename": "output-googlepixel6-1.mp4-1718098394.4777138.json",
          "brands_audio": {
            "entities": [],
            "categories": []
          },
          "brands_video_gcp": {
            "Google": 0.92130274
          },
          "final_logos": {
            "Google": 0.92130274
          },
          "iab_category": {
            "category": [
              "Technology & Computing"
            ]
          },
          "labels": {
            "logo": 0.35979313,
            "mobile device": 0.40358233
          }
        },
        {
          "_id": "66681cd26a14b9bdb14c78f2",
          "video_path": "ad_classify_trigger/Nissan-1.mp4",
          "status": 1,
          "filename": "output-Nissan-1.mp4-1718099150.5264225.json",
          "brands_audio": {
            "entities": [
              "Misun"
            ],
            "categories": [
              "Unknown"
            ],
            "speech_transcript": "Isn't it great when passion ignites performance ignite the excitement misun?",
            "comprehend_results": [],
            "gemini_results": [
              "Misun"
            ]
          },
          "brands_video_gcp": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "final_logos": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "iab_category": {
            "category": [
              "Automotive"
            ]
          },
          "labels": {
            "soccer": 0.62544113,
            "player": 0.65759712,
            "team sport": 0.30484191,
            "sports": 0.77019072,
            "land vehicle": 0.59040409,
            "nissan": 0.45152983,
            "ball game": 0.36392882,
            "motor vehicle": 0.67802572,
            "vehicle": 0.862993,
            "car": 0.56654763
          }
        },
        {
          "_id": "66681f098c314182f5576ef5",
          "video_path": "ad_classify_trigger/pizza-1.mp4",
          "status": 1,
          "filename": "output-pizza-1.mp4-1718099718.3133876.json",
          "brands_audio": {
            "entities": [
              "Pizza Hut",
              "Pizza Hut"
            ],
            "categories": [
              "Restaurant"
            ],
            "speech_transcript": "I remember when I was a kid Smiles came from the simplest things sometimes Smiles came from being around family. Other times Smiles came from listening to our favorite Tunes or even from The Cheeky moments we had and how can I forget the smile? On my special day, but as time goes by Smiles can be hard to come by all I needed. With a little reminder to make me smile again the warmest Smiles come from a special place a place. That's always close to my heart. Thanks Pizza Hut for 35 years of smiles",
            "comprehend_results": [
              "Pizza Hut"
            ],
            "gemini_results": [
              "Pizza Hut"
            ]
          },
          "brands_video_gcp": {
            "Pizza Hut": 0.95025909
          },
          "final_logos": {
            "Pizza Hut": 0.95025909
          },
          "iab_category": {
            "category": [
              "Travel",
              "Food & Drink",
              "Events and Attractions"
            ]
          },
          "labels": {
            "room": 0.74342102,
            "people": 0.46747264,
            "song": 0.61138678,
            "facial expression": 0.33662048
          }
        },
        {
          "_id": "666862d32af7cfc1aa7f084c",
          "video_path": "ad_classify_trigger/Nissan-1-1.mp4",
          "status": 1,
          "filename": "output-Nissan-1-1.mp4-1718117072.0961936.json",
          "brands_audio": {
            "entities": [
              "Misun"
            ],
            "categories": [
              "Product"
            ],
            "speech_transcript": "Isn't it great when passion ignites performance ignite the excitement misun?",
            "comprehend_results": [],
            "gemini_results": [
              "Misun"
            ]
          },
          "brands_video_gcp": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "final_logos": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "iab_category": {
            "category": [
              "Automotive"
            ]
          },
          "labels": {
            "player": 0.65759712,
            "team sport": 0.30484191,
            "nissan": 0.45152983,
            "sports": 0.77019072,
            "land vehicle": 0.59040409,
            "soccer": 0.62544113,
            "ball game": 0.36392882,
            "motor vehicle": 0.67802572,
            "vehicle": 0.862993,
            "car": 0.56654769
          }
        },
        {
          "_id": "6668750e43fc2cf47e42ade3",
          "video_path": "ad_classify_trigger/Nissan-1-2.mp4",
          "status": 1,
          "filename": "output-Nissan-1-2.mp4-1718121738.5388281.json",
          "brands_audio": {
            "entities": [
              "Misun"
            ],
            "categories": [
              "Unknown"
            ],
            "speech_transcript": "Isn't it great when passion ignites performance ignite the excitement misun?",
            "comprehend_results": [],
            "gemini_results": [
              "Misun"
            ]
          },
          "brands_video_gcp": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "final_logos": {
            "Nissan": 0.96314192,
            "Hino Motors": 0.92403585
          },
          "iab_category": {
            "category": [
              "Automotive"
            ]
          },
          "labels": {
            "nissan": 0.45152983,
            "team sport": 0.30484191,
            "soccer": 0.62544113,
            "sports": 0.77019072,
            "land vehicle": 0.59040409,
            "player": 0.65759712,
            "ball game": 0.36392882,
            "motor vehicle": 0.67802572,
            "vehicle": 0.862993,
            "car": 0.56654763
          }
        }
      ]
      // try {
      //   const randomNumber = Math.random(); // Generate a random number between 0 and 1
    
      //   // Adjust this threshold as needed to control the probability of each object being returned
      //   const threshold = 0.5; 
    
      //   let selectedObject;
    
      //   if (randomNumber < threshold) {
      //     selectedObject = Object1;
      //   } else {
      //     selectedObject = Object2;
      //   }
    
      //   res.json(selectedObject);
      // } catch (error) {
      //   console.error('Error fetching records:', error);
      //   res.status(500).json({ error: error.message });
      // }
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

        // // Check if the file already exists in the bucket
        // let [exists] = await bucket.file(filename).exists();

        // Add a numeric suffix if the file exists
        // let suffix = 1;
        // while (exists) {
        //   let parts = filename.split('.');
        //   const extension = parts.pop();
        //   finalFilename = `${parts.join('.')}-${suffix}.${extension}`;
        //   [exists] = await bucket.file(finalFilename).exists();
        //   suffix++;
        // }
        
        // const blob = bucket.file(finalFilename);
        // const blobStream = blob.createWriteStream({
        //   resumable: false,
        //   contentType: req.file.mimetype,
        // });

        // blobStream.on('error', (err) => {
        //   console.error('Blob stream error:', err);
        //   res.status(500).json({ error: 'Internal Server Error' });
        // });

        // blobStream.on('finish', async () => {
        //   try {
        //     console.log('Successfully Uploaded..')
        //     res.status(200).json({filename,success:true});
        //   } catch (error) {
        //     console.error('Error sending response:', error);
        //     res.status(500).json({ error: error.message });
        //   }
        // });

        // blobStream.end(req.file.buffer);
        res.status(200).json({filename,success:true});
      } catch (error) {
        console.error('Error sending response:', error);
        res.status(500).json({ error: error.message });
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
