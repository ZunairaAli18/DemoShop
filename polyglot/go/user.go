package shop

import "time"

type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Cnic      string    `json:"cnic"`
	CreatedAt time.Time `json:"created_at"`
}
