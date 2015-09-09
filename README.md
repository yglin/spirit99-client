# spirit99

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## TODOs
1. Add "expiryDate" field to post, indicate the date when post expires and won't show on map
2. User can follow up post, show user with new comments of followed-up post
3. User can connect posts, with or without any reason

## Portal data from server
| data key | required | type | description | default value |
|:---------:|:--------:|:----------------------:|:------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------:|
| name | * | string | A name used to identify your server, should be as unique as possible | none |
| title | * | string | The title of server to be displayed | none |
| logo |  | url | An image url link to the logo of server  | https://www.evansville.edu/residencelife/images/greenLogo.png |
| postUrl | * | url | A RESTful url used to communicate data with server | none |
| portalUrl |  | url | If given, client will further update server with this new portal url | none |
| iconSet | * | object{name: imageURL} | A set of urls link to image icons, user can choose from which to display post markers on the map | none |

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
