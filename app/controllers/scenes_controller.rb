class ScenesController < ApplicationController
  protect_from_forgery
  def index
  end

  def new
    @characters = Character.all
  end

  def animate
    @scene = TmpScene.last
  end

  def show
  end

  def create
  end

  def create_tmp
    data = TmpScene.new(scene_params)
    data.save
    redirect_to scenes_animate_path
  end

  private
  def scene_params
    params.permit(:json_data)
  end
end
