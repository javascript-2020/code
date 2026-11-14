

## Resource Cache Extension



Cache resources locally and redirect to them through the extension instead of hitting the network everytime.

A lightweight, cross-browser Manifest V3 extension.  It provides a real-time management dashboard, dynamic local
network routing, and fine-grained resource cache control for local development.                                    

It does so through the use of a local server to serve the resource and redirecting webpage network network requests
to the local resource


---


- **server**

the server requires nodejs and should be run with command

```
node file-server.js -s -p 3010
```

-s : tells the server to serve files also, required for cached resources

-p : specifies the port the server runs on ( note: this will be required in the redirect url )

see [file-server [ext-code.com]](https://ext-code.com/code/nodejs/servers/file-server/file-server.html) for full details


navigate to resource cache dashboard, such as

[https://127.0.0.1:3010/html/resource-cache.html](https://127.0.0.1:3010/html/resource-cache.html)


---


- **server_url**

this is where the cached resource will be served, its auto populated based on the webpage

```
https://127.0.0.1:3010/cache/
```

- **url**

this is the url that will be redirected

```
https://cdn.jsdelivr.net/npm/ace-builds/src-min-noconflict/ace.js
```

- **redirect url**

```
ace.js
```

if this is a networked resource `fetch url` will load the resource, edit the filename and click save

to use a local resource, select `localfile`, edit the filename and click save

to use an existing resource click
<img style='border:1px solid gray;border-radius:3px;box-sizing:border-box;width:30px;height:30px;cursor:pointer;vertical-align:middle' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAkFBMVEVHcEyNd4n9DXoCre4Are/vFHgBre77DnoKquYHquf8DXoNr+f7DXr7DXr0EHjpFnUHrOoHq+pxf4llmq3wE3j4DngCre7xEnSVm6H1EHjwE3jzEXgJq+gCre75DnneHW4Fq+sLqejzEXcJq+gCr+0GrOsFrOv4Dnj4Dnj7DXiOVKUErOwErO0ErO3BM5C4OJQxH3O3AAAAMHRSTlMAAf7v/Sfo6y4l9Qzi8GkKY20DBS2E8xYCcTZhGt66A4VZPDixe5mhmM87uLXBamH2lh6LAAABHklEQVQoz62T23aDIBBFccRoQRTveIsaTZqkt///u4KapKlKX7qfmHUWw5yZAUVhGAq0RAjDEBEKkQaBDPTvZEWjkxPm6R49uD906ozQKfJjSU6Yd7N7NEdOo+6fbcaYDUDKWQ52CowDFXgAroQ85Kh6kRzxrkeocCGxLKtkxHvuJR3wR5XtYZ+p0siidKfGXQJusWWMD18MPHloVtsSXS/w6m82oznD5Uo35ZKQz2F0V/XLOcfSU4dr6Q61ZvB7RXzlib7jN5m+r9PgXrpvKRKwD0hId63sETfT+/3cVgDkozuMpxan/Em2J0/0NE/A7FRoqOSxyj47pmoAQWpyY1rGlQWVpfHbrq7Qmhxp5MoROvmB9pcYf32iSGiIvgGWvhS7kcN0DQAAAABJRU5ErkJggg=='>
in the files list to populate the field

- **initiatorDomains**

a comma seperated list, this is the list of domains the redirect will apply to.  if its left blank it will apply to all domains

```
example.com, test.com, 127.0.0.1
```


- **excludedInitiatorDomains**

a comma seperated list, a lis tof domains the redirect wont apply to

```
google.com, youtube.com
```

- **resourceTypes**

this is the type of resource that a redirect will apply to, these can be determined from `dev tools / network / type`

or see [declarativeNetRequest.ResourceType [mdn]](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/declarativeNetRequest/ResourceType)



