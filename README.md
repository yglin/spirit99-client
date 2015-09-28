# spirit99

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Principles
1. Server declares most of its functionalities (What data it presents and what data it can handle) through portal data.
2. Discoverable UI, some user actions bring out more available actions, and take a look at [this article](http://scottberkun.com/essays/26-the-myth-of-discoverability/)

## Portal data from server
| data key | required | type | description | default value |
|:---------:|:--------:|:----------------------:|:------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------:|
| name | * | string | A name used to identify your server, should be as unique as possible | none |
| title | * | string | The title of server to be displayed | none |
| logo |  | url | An image url link to the logo of server  | https://www.evansville.edu/residencelife/images/greenLogo.png |
| postUrl | * | url | A RESTful url used to communicate data with server | none |
| portalUrl |  | url | If given, client will further update server with this new portal url | none |
| iconSet | * | object{name: iconObject} | A set of icon objects, user can choose from which to display post markers on the map | none |

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
