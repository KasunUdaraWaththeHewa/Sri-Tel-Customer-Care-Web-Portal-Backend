package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func main() {
	router := gin.Default()

	router.POST("/api/upload", fileUploadHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "4908"
	}

	// Start the server
	fmt.Printf("Server started on port %s\n", port)
	router.Run(":" + port)
}
func fileUploadHandler(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		// c.JSON(http.StatusBadRequest, gin.H{
		// 	"error": "Error retrieving the file",
		// })
		c.JSON(http.StatusBadRequest, gin.H{
			"success":    false,
			"statusCode": http.StatusBadRequest,
			"message":    "Error retrieving the file",
		})
		return
	}

	// Open the file
	file, err := fileHeader.Open()
	if err != nil {
		// c.JSON(http.StatusInternalServerError, gin.H{
		// 	"error": "Error opening the file",
		// })
		c.JSON(http.StatusInternalServerError, gin.H{
			"success":    false,
			"statusCode": http.StatusInternalServerError,
			"message":    "Error opening the file",
		})

		return
	}
	defer file.Close()

	// Generate a unique filename using UUID
	uniqueID, _ := uuid.NewUUID()
	// only add file extension after UUID

	ext := filepath.Ext(fileHeader.Filename)

	// Create a new filename with the UUID and the original file extension
	newFilename := fmt.Sprintf("%s%s", uniqueID.String(), ext)

	if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
		os.Mkdir("./uploads", 0755)
	}

	dst, err := os.Create("./uploads/" + newFilename)
	if err != nil {
		// c.JSON(http.StatusInternalServerError, gin.H{
		// 	"error": "Failed to create file",
		// })
		c.JSON(http.StatusInternalServerError, gin.H{
			"success":    false,
			"statusCode": http.StatusInternalServerError,
			"message":    "Failed to create file",
		})

		return
	}
	defer dst.Close()

	os.Chmod("./uploads/"+newFilename, 0766)

	// Copy the uploaded file to the new file
	if _, err := io.Copy(dst, file); err != nil {
		// c.JSON(http.StatusInternalServerError, gin.H{
		// 	"error": "Failed to save file",
		// })
		c.JSON(http.StatusInternalServerError, gin.H{
			"success":    false,
			"statusCode": http.StatusInternalServerError,
			"message":    "Failed to save file",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"statusCode": http.StatusOK,
		"message":    "File successfully uploaded",
		"data": gin.H{
			"filename": newFilename,
		},
	})

}
