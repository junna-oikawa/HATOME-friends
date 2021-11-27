class PracticesController < ApplicationController
  protect_from_forgery

  def index
  end

  def create
    @data = Practice.new(practice_params)
    @data.save
    redirect_to practice_path(@data.id)
    
  end

  def show
    @data = Practice.find(params[:id])
  end

  private
  def practice_params
    params.permit(:json_data)
   end

end
