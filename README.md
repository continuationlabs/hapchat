hapchat
=======

hapi.js training for creating a hapi.js based snapchat application

Client
------
- Sends photo to server
- Receives ids of photos from server
- Request photos from server
 
Server
------
- Maintain list of users signed on
- Receives photos from client
- Store photos for period of time
- Distributes Id info about photos
- Serve photos to clients

Project Setup
=============

For now let's put hapchat into it's own directory, with the idea of moving it to its' own repository once we get it together. 

We'll create a hapi server with slides being served in the 'presentation' directory until someone comes up with a better idea.

Initial Plan
============

This is just a better plan than I had voiced in the meeting earlier. I put this stuff in here just to have placeholders really, there's nothing we can't change. I just thought that this was a good 

* Introduce hapi
  * create project, normal setup, go over server options, refer people to reference
  * create a deployment or something so it's immediately testable
  * this is psuedo boring - we need to move into ...
* Routes
  * Introduce hapi routing
  * create route for IDs && individual ID
  * create upload route
  * refer to docs for further instructions
  * we want to see this stuff - segway to
* Views (Adam)
  * templates & languages
  * registering own template
  * replying with views
  * dang people be using this, we need ...
* Auth and Security
  * talk briefly about it
  * talk about registering your own
  * set up Bell
  * Dag what is Bell? It's a plugin. What are those ...
* Plugins (Colin)
  * how they do
  * loads of premade ones
  * install a couple and show what they do.

Wrap up.
