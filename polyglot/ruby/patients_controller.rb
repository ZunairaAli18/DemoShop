class PatientsController < ApplicationController
  def show
    @patient = Patient.find(params[:id])
    render json: @patient
  end
end
