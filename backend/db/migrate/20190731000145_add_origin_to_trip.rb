class AddOriginToTrip < ActiveRecord::Migration[5.2]
  def change
    add_column :trips, :origin, :string
  end
end
