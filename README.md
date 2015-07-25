# spirit99

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

# Portal data from server
|    data key   | required |     type    |                                            description                                           |                         default value                         |
|:-------------:|:--------:|:-----------:|:------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------:|
|      name     |     *    |    string   |                        An universal-unique name used to identified server                        |                              none                             |
|     title     |     *    |    string   |                                The title of server to be displayed                               |                              none                             |
|      logo     |          |     url     |                             An image url link to the logo of server                              | https://www.evansville.edu/residencelife/images/greenLogo.png |
|    postUrl    |     *    |     url     |                        A RESTful url used to communicate data with server                        |                              none                             |
|   portalUrl   |          |     url     |               If given, client will further update server with this new portal url               |                              none                             |
| markerIconSet |          | array[url,] | A set of urls link to image icons, user can choose from which to display post markers on the map |                                                               |

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
# spirit99-client
