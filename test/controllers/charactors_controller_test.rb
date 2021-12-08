require 'test_helper'

class CharactorsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get charactors_new_url
    assert_response :success
  end

  test "should get confirm" do
    get charactors_confirm_url
    assert_response :success
  end

  test "should get name" do
    get charactors_name_url
    assert_response :success
  end

end
