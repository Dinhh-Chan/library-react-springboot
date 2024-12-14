import pandas as pd

# Đọc file CSV vào DataFrame
df = pd.read_csv('/home/dinhchan/Documents/project/library-react-springboot/data/data_1.csv')

# Xóa các cột không cần thiết
columns_to_drop = ['isbn13', 'isbn10', 'subtitle', 'average_rating', 'num_pages', 'ratings_count']
df = df.drop(columns=columns_to_drop)

# Lưu lại file CSV sau khi xóa các cột
df.to_csv('data_modified.csv', index=False)