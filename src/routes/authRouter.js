const { Router } = require('express');
const express = require('express');
const google = require('googleapis');
const axios = require('axios').default;
const usersController = require('../controllers/usersController');
const router = require('./usersRouter');

const authRouter = express.Router();
const { createNewUser } = usersController; 

const clientId = '1048891946125-5gt1749rgiuhbmfc3v9414aabld23gjl.apps.googleusercontent.com' || process.env.CLIENT_ID;
const clientSecret = 'fhAOACf_O8cNNcoxmGt7Ke1s' || process.env.CLIENT_SECRET;

const oauth2Client = new google.Auth.OAuth2Client(
    clientId,
    clientSecret,
    'localhost/3000/auth_user'
);

function getGoogleAuthUrl() {

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ];
  
      return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes
      });
}

async function getGoogleUser({ code }) {
    
    const { tokens } = await oauth2Client.getToken(code);

    const googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
            headers: {
              Authorization: `Bearer ${tokens.id_token}`,
            },
          },
        )
        .then(res => res.data)
        .catch(err => { throw new Error(err.message); });
    

    return googleUser;
}

async googleAuth(input, context) {

    const googleUser = await getGoogleUser({ code: input.code });

    let user;
}
