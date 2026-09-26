class PatientsController < ApplicationController
  def show
    @patient = Patient.find(params[:id])
    render json: { id: @patient.id, name: @patient.name }
  end
end
