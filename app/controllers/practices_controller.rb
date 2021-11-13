class PracticesController < ApplicationController
  protect_from_forgery

  def index
  end

  def create
    @data = Practice.new(json_data:params[:data])
    @data.save
    redirect_to practice_path(@data.id)
    
  end

  def show
    
  end

  private
  def practice_params
    params.permit(:name)
  end

end
