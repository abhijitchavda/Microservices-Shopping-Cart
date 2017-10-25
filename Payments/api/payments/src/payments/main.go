package main

// Import libraries
import (
	'os'
)
/*

Function name: main
Parameters: None
Purpose: Specify server port and start listening on the specified port
Return value: None

*/
func main(){
	port:=os.Getenv("PORT")
	if len(port) == 0{
		port = "3000"
	}
	// Create a new server
	server := NewServer()
	// Start listening on specified port
	server.Run(":" + port)
}