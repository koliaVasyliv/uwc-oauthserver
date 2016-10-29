# OAuthServer
## Description

The OAuthServer allow you to register on site, fill in your 
personal data and use these data on other websites that will use this 
service.

I am using REST API architecture. To use data, other web clients 
needs to get permission over OAuth 2. If user change any data, clients 
where this user have registered, will get the webhook. I made it like
background tasks. So user don't need to wait while all request will be 
done. Also if requests failed, it will retry 20 attempts with 
exponentional backoffs.

## Instructions
Install node, mongodb and redis at first.

Open directory Server and write in terminal:
```
npm install
npm start
```
The server is running on the port: 3000.

Register your new account and add new site. Then go to 'Add site' once
more, and you will see your new site has been added. If you click on the 
link you will get your client_id and secret. To test oauth you need to
add this information to *"Clients/routes/index.js"* file.

Then you can open Client folder and write in terminal:
```
npm install
npm start
```
The client is running on the port 3001.
To test oauth click on the link to get data user.

## API
You can get avatar by email for registered users like gravatar service.
Note! You get image without OAuth 2.
```
GET: localhost:3000/api/:email
```
You will get image in return.

To get users data:
```
GET: localhost:3000/api/users/:username

{
    "username": "foo",
    "email": "email@mail.com",
    "bio": "something...",
    "avatar": "src_url"
}
```
You can specify by params which data you need exactly.
```
GET: localhost:3000/api/users/:username?bio&username

{
    "username": "foo",
    "bio": "something..."
}
```

## OAuth
To get user data clients need to send GET request. 
Where 'client_id' is id that you get on SingleSignService and 
redirect_uri is url on which will be sent GET request with code.
```
GET: http://localhost:3000/api/oauth2/authorize?client_id=clientId&response_type=code&redirect_uri=client_url`
```
User will be asked to filled in Basic authentication form. And then will
be asked to allow or deny permission.
After permission was allowed you get back GET request with code.
Then send request for token with such params:
```
    url: 'http://localhost:3000/api/oauth2/token',
    method: 'POST',
    headers: {
        'Authorization': 'Basic Buffer.from(clientId+':'+secret).toString('base64')
    },
    form: {
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3001'
    }
```
After this you can user Bearer authentication with token to get users data.
