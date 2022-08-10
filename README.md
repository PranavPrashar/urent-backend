
# U-Rent READ.ME

U-Rent, allows Canadian university students to find rental properties for the upcoming year in 
addition to contact information about the corresponding list as well as favorite listings which they might like. 
The platform also gives landlords a platform for listings, allowing both students and landlords to have a great 
platform to find but also post properties and rentals

# Frontend Github Repository

https://github.com/PranavPrashar/urent-frontend




## Deployment Backend

To deploy this project run

```bash
  cd into capstone-backend
```
```bash
  npm install
```

```bash
  npm i nodemon
```

```bash
  nodemon index.js
```


## Features

- Users can register and login for an account, being authenticated through the use of JWT
- Create Listing
- Read/View Listings
- Update Listings
- Delte Listings
- Users can also favoruite listings which they might want to view later
- Users can see past listings which they have posted 
- View Details about listings
- See listings based on city, for example; Toronto, Waterloo, Guelph, London .....more to come



## Tech Stack

**Client:** React, Scss

**Server:** Node, Express, Multer Js, Knex.js, Cloudinary

**Database:** MySQL


## Lessons Learned

Through this experience and project, some things I learned include:

How to brainstorm and plan out a project and its various stages, should i start with my frontend end first and then develop endpoints or vice versa. For example, what kinds of endpoints should be developed, and what data should I be sending. 

Planning my database schema to have primary and foreign keys to help reference things like the user's favorite listings or images for each listing. 

As well as working with libraries such as Multer, and Knex.js. This project was the first time I had to handle both form data but also files that a user is uploading. This was done through reading documentation and lots of problem-solving. 

This project also taught me how to authenticate users using JWT authentication and authorizing only certain groups such as Registered/Logged in users to be able to use certain parts of the application 

## Next Steps
- Develop Dynamic map for each listing allowing users to see where the listing is located
- Integrate transit view allowing users to see routes and near by transportation access
- Forum for users to post if they are looking for a roommate 
- Chat function to get in contact with the landlord, allowing all converstations and info in one central location

## Screenshots
#### Mobile Home Page:
![Mobile Home Page](https://i.imgur.com/PFAcEQ7.png)
#### Tablet/Desktop Home Page
![Tablet/Desktop Home Page](https://i.imgur.com/xiO1L6z.png)


#### Edit Listing Screen
![Edit Listing Screen](https://i.imgur.com/tt3H4iS.png)
#### My Listings Page
![Tablet/Desktop Home Page](https://i.imgur.com/zgq7wp2.png)
#### Upload Listing page with Multer Image upload
![Upload Listing page with Multer Image upload](https://i.imgur.com/j0nv3ei.png)
#### Example Property listing details page
![Upload Listing page with Multer Image upload](https://i.imgur.com/KcGEkQS.png)


#### Example Property listing details Mobile
![Upload Listing page with Multer Image upload](https://i.imgur.com/dcDd0at.png)





