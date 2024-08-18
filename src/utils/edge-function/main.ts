// an edge function hosted on appwrite

// import sdk, { Query } from 'node-appwrite'


// export default async ({ req, res, log, error }) => {
//     console.log('Request received');
//     console.log(req.body)

//     const telegram_id = JSON.parse(req.body).telegram_id;
//     console.log(telegram_id)

//     if (!telegram_id) {
//         console.error('telegram_id is required');
//         return res.json({
//             status: 'error',
//             message: 'telegram_id is required'
//         });
//     }
//     // Initialize Appwrite client
//     const client = new sdk.Client()
//         .setEndpoint("https://cloud.appwrite.io/v1")
//         .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
//         .setKey(process.env.APPWRITE_API_KEY);

//     // Initialize Users service
//     const users = new sdk.Users(client);
//     const database = new sdk.Databases(client)


//     // check if the telegram_id already exists in profiles
//     try {
//         const doesProfileExist = await database.getDocument(
//             "66a0bb690022ca66f9c3",
//             '66a5250600381d1e12d0',
//             telegram_id.toString(),
//             []               // Document ID
//         );

//         // If the profile exists, handle the existing profile case
//         console.log('Profile already exists:', doesProfileExist);

//         // Create a token for the existing profile
//         const token = await users.createToken(telegram_id.toString());
//         const secret = token.secret;

//         // Return the token and profile data
//         return res.json({
//             status: 'success',
//             token: token.id,
//             secret: secret,
//             data: doesProfileExist
//         });

//     } catch (error) {
//         // Handle the case where the profile does not exist (or other errors)
//         // if (error.code === 'DOCUMENT_NOT_FOUND') {
//         // If the profile does not exist, proceed to create a new profile
//         const result = await users.create(telegram_id);
//         console.log(result);



//         try {
//             const newProfile = await database.createDocument(
//                 "66a0bb690022ca66f9c3",
//                 '66a5250600381d1e12d0',                // Collection ID
//                 telegram_id.toString(),                // Use 'unique()' to generate a unique document ID
//                 { name: JSON.parse(req.body).name, username: JSON.parse(req.body).username, profile_pic: JSON.parse(req.body).profile_pic }  // Document data
//             );
//             // Create a token for the newly created profile
//             const token = await users.createToken(telegram_id.toString());
//             const secret = token.secret;
//             console.log('Profile created successfully:', newProfile);

//             // Return the token and the new profile data
//             return res.json({
//                 status: 'success',
//                 token: token.id,
//                 secret: secret,
//                 data: newProfile
//             });
//         } catch (creationError) {
//             console.error('Error creating profile:', creationError);
//         }




//         // }
//     }
// }
