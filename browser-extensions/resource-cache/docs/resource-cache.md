

## Resource Cache Extension



Cache resources locally and redirect to them through the extension instead of hitting the network everytime.

A lightweight, cross-browser Manifest V3 extension.  It provides a real-time management dashboard, dynamic local
network routing, and fine-grained resource cache control for local development.                                    

---

- **server**

the server requires nodejs and should be run with command

```
node file-server-full.js -s -p 3010
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

