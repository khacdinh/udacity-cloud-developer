import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get('/filteredimage', async (req: Request, res: Response) => {
    const imageUrl:string = req.query['image_url'];
    if(imageUrl == null || imageUrl == '') {
      res.status(400).send('input image_url is required');
    }

    if(!/^https?:\/\/.+/i.test(imageUrl)) {
      res.status(400).send('input image_url is not a valid URL.');
    }

    try {
      const filteredPath = await filterImageFromURL(imageUrl);
      res.sendFile(filteredPath, (err) => {
        // Delete the file from the server after it's been sent.
        fs.unlink(filteredPath, (err) => { });
      })
    } catch(error) {
      res.status(422).send('Can not processing image: ' + error);
    }
  })

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();