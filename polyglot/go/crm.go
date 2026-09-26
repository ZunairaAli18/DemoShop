package shop

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
)

// SyncToCrm sends a user signup event to the external CRM.
func SyncToCrm(u User) error {
	body, err := json.Marshal(struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	}{ID: u.ID, Name: u.Name})
	if err != nil {
		return err
	}
	resp, err := http.Post(os.Getenv("CRM_URL"), "application/json", bytes.NewReader(body))
	if err != nil {
		return err
	}
	return resp.Body.Close()
}
