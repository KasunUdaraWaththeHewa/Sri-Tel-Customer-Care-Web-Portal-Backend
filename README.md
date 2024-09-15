# Sri Tel Backend Services


## Setup

```bash
docker compose up
```

## Email Service

`http://localhost:8025/`



## Upload Service & file server


### Uploading a file

`http://localhost:4908/api/upload`

```bash
curl -F "file=@image.png" http://localhost:4908/api/upload
```


### Accessing the file

`http://localhost:4980/uploads/<generated_file_name>`

