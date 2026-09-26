class PatientsController < ApplicationController
  # GET /patients/:id
  # Returns only public fields; never render the whole patient.
  def show
    @patient = Patient.find(params[:id])
    render json: { id: @patient.id, name: @patient.name }
  end
end
