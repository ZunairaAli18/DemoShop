# Columns: id, name, email, phone, cnic
class Patient < ApplicationRecord
  validates :name, presence: true
end
