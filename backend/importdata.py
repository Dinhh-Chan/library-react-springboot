import csv
import io
import random
from sqlalchemy import create_engine, Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.engine.url import URL

# Định nghĩa Base
Base = declarative_base()

# Định nghĩa các bảng liên kết nhiều-nhiều
book_authors = Table('book_authors', Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('author_id', Integer, ForeignKey('authors.id'), primary_key=True)
)

book_categories = Table('book_categories', Base.metadata,  # Đảm bảo tên bảng nhất quán
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.id'), primary_key=True)
)

# Định nghĩa mô hình Author
class Author(Base):
    __tablename__ = 'authors'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    bio = Column(String)

    books = relationship('Book', secondary=book_authors, back_populates='authors')

# Định nghĩa mô hình Book
class Book(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    link_file = Column(String)
    description = Column(String)
    published_year = Column(Integer)

    authors = relationship('Author', secondary=book_authors, back_populates='books')
    categories = relationship('Category', secondary=book_categories, back_populates='books')

# Định nghĩa mô hình Category
class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    category_name = Column(String, nullable=False, unique=True)

    books = relationship('Book', secondary=book_categories, back_populates='categories')

# Cấu hình cơ sở dữ liệu
DATABASE = {
    'drivername': 'postgresql+psycopg2',
    'username': 'library_user',
    'password': 'library_pass',
    'host': 'localhost',  # Hoặc địa chỉ IP của container Docker nếu cần
    'port': '54338',
    'database': 'library_management'
}

# Tạo URL kết nối
database_url = URL.create(
    drivername=DATABASE['drivername'],
    username=DATABASE['username'],
    password=DATABASE['password'],
    host=DATABASE['host'],
    port=DATABASE['port'],
    database=DATABASE['database']
)

# Tạo engine
engine = create_engine(database_url)

# Tạo các bảng trong cơ sở dữ liệu nếu chưa tồn tại
Base.metadata.create_all(engine)

# Tạo session
Session = sessionmaker(bind=engine)
session = Session()

# Hàm tạo bio giả cho tác giả
def generate_bio():
    bios = [
        "Một tác giả nổi tiếng với nhiều tác phẩm xuất sắc trong lĩnh vực văn học.",
        "Chuyên viết về các chủ đề liên quan đến tâm lý và xã hội.",
        "Tác giả trẻ đầy nhiệt huyết với phong cách viết độc đáo.",
        "Đã giành được nhiều giải thưởng văn học danh giá.",
        "Chuyên sâu vào thể loại tiểu thuyết trinh thám và giả tưởng.",
        "Tác giả có kinh nghiệm phong phú trong việc kể chuyện.",
        "Biên kịch và nhà văn nổi tiếng với các tác phẩm lôi cuốn.",
        "Được biết đến với khả năng xây dựng nhân vật mạnh mẽ.",
        "Tác giả có tầm nhìn sâu rộng về các vấn đề nhân văn.",
        "Chuyên viết về lịch sử và các sự kiện quan trọng."
    ]
    return random.choice(bios)

# Đường dẫn đến tệp CSV
csv_file_path = './backend/data.csv'

# Đọc dữ liệu CSV
with open(csv_file_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    books_data = list(reader)[:50]  # Lấy 50 cuốn sách đầu tiên

# Thu thập danh sách độc giả và thể loại duy nhất
authors_dict = {}
categories_set = set()

for row in books_data:
    # Xử lý tác giả
    authors = [author.strip() for author in row['authors'].split(';')]
    for author_name in authors:
        if author_name not in authors_dict:
            authors_dict[author_name] = generate_bio()
    
    # Xử lý thể loại
    categories = [category.strip() for category in row['categories'].split(';')]
    for category_name in categories:
        categories_set.add(category_name)

# Thêm Authors vào cơ sở dữ liệu
for author_name, bio in authors_dict.items():
    existing_author = session.query(Author).filter_by(name=author_name).first()
    if not existing_author:
        author = Author(name=author_name, bio=bio)
        session.add(author)

# Thêm Categories vào cơ sở dữ liệu
for category_name in categories_set:
    existing_category = session.query(Category).filter_by(category_name=category_name).first()
    if not existing_category:
        category = Category(category_name=category_name)
        session.add(category)

# Commit Authors và Categories
session.commit()

# Lặp qua từng cuốn sách để thêm vào cơ sở dữ liệu
for row in books_data:
    # Xử lý tác giả
    authors = [author.strip() for author in row['authors'].split(';')]
    author_objs = []
    for author_name in authors:
        author = session.query(Author).filter_by(name=author_name).first()
        if author:
            author_objs.append(author)
    
    # Xử lý thể loại
    categories = [category.strip() for category in row['categories'].split(';')]
    category_objs = []
    for category_name in categories:
        category = session.query(Category).filter_by(category_name=category_name).first()
        if category:
            category_objs.append(category)
    
    # Kiểm tra xem cuốn sách đã tồn tại chưa
    existing_book = session.query(Book).filter_by(title=row['title']).first()
    if existing_book:
        print(f"Cuốn sách '{row['title']}' đã tồn tại. Bỏ qua.")
        continue
    
    # Tạo đối tượng Book
    try:
        published_year = int(float(row['published_year']))
    except ValueError:
        published_year = None  # Hoặc đặt một giá trị mặc định khác

    book = Book(
        title=row['title'],
        quantity=10,  # Đặt số lượng mặc định, bạn có thể thay đổi nếu cần
        link_file=row['thumbnail'],  # Giả sử 'thumbnail' là đường link file
        description=row['description'],
        published_year=published_year
    )
    
    # Thêm tác giả và thể loại vào sách
    book.authors = author_objs
    book.categories = category_objs
    
    # Thêm sách vào session
    session.add(book)

# Commit tất cả các thay đổi
session.commit()

print("Đã nhập thành công 50 cuốn sách vào cơ sở dữ liệu.")
