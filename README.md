**A sample application that shows how to interact remotely with IBM Bluemix Container Service via API**

## Summary

This is a sample application that shows how to use the API to interact with IBM Bluemix Container Service

The IBM Bluemix Container Service API is available at: http://ccsapi-doc.mybluemix.net

## Deployment

The application could be run locally, using a local instance of nodejs.

    $ node app.js

The application could also be deployed on Bluemix by using the [manifest](./manifest.yml) file

    $ cf push

Be careful with the route used for the deployment, the route could be already used. May be you have to change it for your deployment. 

## Contributing

Jérôme Tarte, IBM Cloud Advisor, jerome.tarte@fr.ibm.com

## License

Copyright IBM Corp. 2017

This project is licensed under Apache license - see the [license.md](./license.md) file
