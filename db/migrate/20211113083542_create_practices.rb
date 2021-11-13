class CreatePractices < ActiveRecord::Migration[5.2]
  def change
    create_table :practices do |t|
      t.text :json_data

      t.timestamps
    end
  end
end
