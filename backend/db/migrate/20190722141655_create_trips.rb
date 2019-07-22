class CreateTrips < ActiveRecord::Migration[5.2]
  def change
    create_table :trips do |t|
      t.string :destination
      t.string :address
      t.integer :capacity
      t.datetime :start_time
      t.datetime :end_time

      t.timestamps
    end
  end
end
