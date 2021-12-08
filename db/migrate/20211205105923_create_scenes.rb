class CreateScenes < ActiveRecord::Migration[5.2]
  def change
    create_table :scenes do |t|
      t.text :json_data

      t.timestamps
    end
  end
end
