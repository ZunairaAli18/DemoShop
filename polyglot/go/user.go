package shop

type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
	Cnic  string `json:"cnic"`
}
