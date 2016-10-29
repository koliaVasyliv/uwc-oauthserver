## Single Sign Service
### Scalability

My webservice can be easily scaled up.

I am using MongoDB in my webservice. So if I will need to scaled it,
I can easy add new cluster and use sharding to distribute requests 
and replica sets to get more safety.

My webservice could be run on nginx and I can make as many nodes of my
service as I need. The load balancer on nginx will requests every nodes
in circle. So I can easily handle high load.