import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from urllib.parse import quote_plus
import datetime

# Định nghĩa Base cho SQLAlchemy
Base = declarative_base()

# Định nghĩa các bảng liên kết nhiều-nhiều
book_authors = Table('book_authors', Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('author_id', Integer, ForeignKey('authors.id'), primary_key=True)
)

book_categories = Table('book_categories', Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.id'), primary_key=True)
)

# Định nghĩa các mô hình bảng
class Author(Base):
    __tablename__ = 'authors'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    bio = Column(String)

    books = relationship('Book', secondary=book_authors, back_populates='authors')

class Book(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    quantity = Column(Integer)
    link_file = Column(String)
    bio = Column(String)  # Thêm trường bio
    year = Column(Integer)  # Thêm trường year

    authors = relationship('Author', secondary=book_authors, back_populates='books')
    categories = relationship('Category', secondary=book_categories, back_populates='books')
    inventory = relationship('Inventory', uselist=False, back_populates='book')
    borrowings = relationship('Borrowing', back_populates='book')

class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    category_name = Column(String, nullable=False)

    books = relationship('Book', secondary=book_categories, back_populates='categories')

class Inventory(Base):
    __tablename__ = 'inventory'
    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey('books.id'))
    total_stock = Column(Integer)
    available_stock = Column(Integer)

    book = relationship('Book', back_populates='inventory')

class Borrowing(Base):
    __tablename__ = 'borrowings'
    id = Column(Integer, primary_key=True)
    reader_id = Column(Integer, ForeignKey('readers.id'))
    book_id = Column(Integer, ForeignKey('books.id'))
    borrow_date = Column(Date)
    return_date = Column(Date)
    actual_return_date = Column(Date, nullable=True)
    status = Column(String)

    reader = relationship('Reader', back_populates='borrowings')
    book = relationship('Book', back_populates='borrowings')

class Reader(Base):
    __tablename__ = 'readers'
    id = Column(Integer, primary_key=True)
    contact_info = Column(String)
    quota = Column(Integer)
    username = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    borrowings = relationship('Borrowing', back_populates='reader')

# Kết nối đến PostgreSQL
DATABASE = {
    'drivername': 'postgresql+psycopg2',
    'username': 'library_user',
    'password': 'library_pass',
    'host': 'localhost',  # Hoặc địa chỉ IP của container Docker nếu cần
    'port': '54338',
    'database': 'library_management'
}

# Tạo URL kết nối
DATABASE_URL = f"{DATABASE['drivername']}://{quote_plus(DATABASE['username'])}:" \
              f"{quote_plus(DATABASE['password'])}@{DATABASE['host']}:" \
              f"{DATABASE['port']}/{DATABASE['database']}"

# Tạo engine
engine = create_engine(DATABASE_URL, echo=True)

# Tạo tất cả các bảng
Base.metadata.create_all(engine)

# Tạo session
Session = sessionmaker(bind=engine)
session = Session()

# ------------------ Chèn Dữ Liệu ------------------

# 1. Chèn dữ liệu vào bảng authors
authors_data = [
    (1, "Nguyễn Văn An", "Nguyễn Văn An là một tác giả nổi tiếng với nhiều tác phẩm văn học sâu sắc."),
    (2, "Trần Thị Bình", "Trần Thị Bình chuyên viết về lịch sử và văn hóa Việt Nam."),
    (3, "Lê Thị Cúc", "Lê Thị Cúc là nhà văn trẻ với nhiều tác phẩm tiểu thuyết hấp dẫn."),
    (4, "Phạm Văn Dũng", "Phạm Văn Dũng là chuyên gia trong lĩnh vực khoa học máy tính."),
    (5, "Hoàng Thị Em", "Hoàng Thị Em đã xuất bản nhiều sách giáo khoa và tài liệu học tập."),
    (6, "Đỗ Minh Huy", "Đỗ Minh Huy là nhà nghiên cứu trong lĩnh vực y học."),
    (7, "Ngô Thị Hà", "Ngô Thị Hà là nhà văn với nhiều truyện ngắn nổi tiếng."),
    (8, "Huỳnh Văn Khoa", "Huỳnh Văn Khoa chuyên viết về kinh tế và quản trị doanh nghiệp."),
    (9, "Đặng Thị Lan", "Đặng Thị Lan là giảng viên đại học và tác giả nhiều sách giáo trình."),
    (10, "Phan Minh Long", "Phan Minh Long là nhà báo với nhiều bài viết phân tích sâu sắc."),
    (11, "Nguyễn Thị Mai", "Nguyễn Thị Mai là nhà thơ với nhiều bài thơ được đánh giá cao."),
    (12, "Trần Văn Nam", "Trần Văn Nam là nhà nghiên cứu trong lĩnh vực công nghệ thông tin."),
    (13, "Lê Thị Oanh", "Lê Thị Oanh là biên kịch và nhà sản xuất phim."),
    (14, "Phạm Minh Phương", "Phạm Minh Phương là nhà thiết kế đồ họa và nghệ sĩ số."),
    (15, "Hoàng Văn Quang", "Hoàng Văn Quang chuyên viết về du lịch và khám phá."),
    (16, "Đỗ Thị Rượu", "Đỗ Thị Rượu là nhà văn trẻ với nhiều tác phẩm khoa học viễn tưởng."),
    (17, "Ngô Minh Sơn", "Ngô Minh Sơn là chuyên gia về môi trường và phát triển bền vững."),
    (18, "Huỳnh Thị Trang", "Huỳnh Thị Trang là nhà giáo dục và tác giả sách giáo dục."),
    (19, "Đặng Văn Tú", "Đặng Văn Tú là kỹ sư phần mềm với nhiều dự án thành công."),
    (20, "Phan Thị Uyên", "Phan Thị Uyên là nhà văn với nhiều tiểu thuyết bán chạy.")
]


# 2. Chèn dữ liệu vào bảng categories
categories_data = [
    (1, "Văn học"),
    (2, "Lịch sử"),
    (3, "Khoa học máy tính"),
    (4, "Y học"),
    (5, "Giao dục"),
    (6, "Tin học"),
    (7, "Truyện ngắn"),
    (8, "Kinh tế"),
    (9, "Giáo trình"),
    (10, "Báo chí"),
    (11, "Thơ"),
    (12, "Công nghệ thông tin"),
    (13, "Điện ảnh"),
    (14, "Đồ họa"),
    (15, "Du lịch"),
    (16, "Viễn tưởng"),
    (17, "Môi trường"),
    (18, "Sách giáo dục"),
    (19, "Kỹ thuật phần mềm"),
    (20, "Tiểu thuyết")
]

# 3. Chèn dữ liệu vào bảng books
books_data = [
    (1, "Văn học Việt Nam", 50, "https://example.com/books/vanhocvietnam.pdf", "Tác phẩm nổi bật của văn học Việt Nam.",  2020),
    (2, "Lịch sử Việt Nam", 40, "https://example.com/books/lichsuvietnam.pdf", "Tài liệu lịch sử Việt Nam qua các thời kỳ.",  2018),
    (3, "Giới thiệu về Java", 30, "https://example.com/books/java_intro.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (4, "Y học hiện đại", 25, "https://example.com/books/yhoc_hientai.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (5, "Giao dục cơ bản", 35, "https://example.com/books/giaoduc_coban.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (6, "Tin học đại cương", 45, "https://example.com/books/tinhoc_daicuong.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (7, "Truyện ngắn Việt", 20, "https://example.com/books/truyennhienvietnam.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (8, "Kinh tế học", 15, "https://example.com/books/kinhtehoc.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (9, "Giáo trình đại số", 50, "https://example.com/books/giaotrinh_daiso.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (10, "Báo chí và truyền thông", 30, "https://example.com/books/baochi_truyenthong.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (11, "Thơ Việt Nam", 25, "https://example.com/books/tho_vietnam.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (12, "Công nghệ thông tin ứng dụng", 40, "https://example.com/books/congnghe_ttungdung.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (13, "Điện ảnh Việt Nam", 20, "https://example.com/books/dienanh_vietnam.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (14, "Đồ họa kỹ thuật số", 35, "https://example.com/books/dohoa_kithuatso.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (15, "Du lịch thế giới", 30, "https://example.com/books/dulich_thegioi.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (16, "Viễn tưởng và giả tưởng", 20, "https://example.com/books/vientuong_giatuong.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (17, "Môi trường và phát triển", 25, "https://example.com/books/moitruong_phattrien.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (18, "Sách giáo dục tiểu học", 40, "https://example.com/books/sachgiaoduc_tieuhoc.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (19, "Kỹ thuật phần mềm", 30, "https://example.com/books/kithuatphanmem.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021),
    (20, "Tiểu thuyết lãng mạn", 20, "https://example.com/books/tieuthuyet_langman.pdf", "Giới thiệu cơ bản về lập trình Java.",  2021)
]

# 4. Chèn dữ liệu vào bảng book_authors
book_authors_data = [
    (1,1), (1,11),
    (2,2), (2,12),
    (3,3), (3,13),
    (4,4), (4,14),
    (5,5), (5,15),
    (6,6), (6,16),
    (7,7), (7,17),
    (8,8), (8,18),
    (9,9), (9,19),
    (10,10), (10,20),
    (11,1), (11,11),
    (12,2), (12,12),
    (13,3), (13,13),
    (14,4), (14,14),
    (15,5), (15,15),
    (16,6), (16,16),
    (17,7), (17,17),
    (18,8), (18,18),
    (19,9), (19,19),
    (20,10), (20,20)
]

# 5. Chèn dữ liệu vào bảng book_category
book_category_data = [
    (1,1), (1,2),
    (2,2), (2,1),
    (3,3), (3,6),
    (4,4), (4,7),
    (5,5), (5,18),
    (6,6), (6,3),
    (7,7), (7,1),
    (8,8), (8,2),
    (9,5), (9,19),
    (10,10), (10,4),
    (11,11), (11,1),
    (12,12), (12,3),
    (13,13), (13,7),
    (14,14), (14,3),
    (15,15), (15,8),
    (16,16), (16,7),
    (17,17), (17,4),
    (18,5), (18,18),
    (19,19), (19,3),
    (20,20), (20,1)
]

# # 6. Chèn dữ liệu vào bảng inventory
inventory_data = [
    (1,1,100,100),
    (2,2,80,80),
    (3,3,60,60),
    (4,4,50,50),
    (5,5,70,70),
    (6,6,90,90),
    (7,7,40,40),
    (8,8,30,30),
    (9,9,120,120),
    (10,10,110,110),
    (11,11,85,85),
    (12,12,95,95),
    (13,13,65,65),
    (14,14,75,75),
    (15,15,55,55),
    (16,16,100,100),
    (17,17,45,45),
    (18,18,35,35),
    (19,19,25,25),
    (20,20,15,15),
    (21,21,100,100),
    (22,22,80,80),
    (23,23,60,60),
    (24,24,50,50),
    (25,25,70,70),
    (26,26,90,90),
    (27,27,40,40),
    (28,28,30,30),
    (29,29,120,120),
    (30,30,110,110),
    (31,31,85,85),
    (32,32,95,95),
    (33,33,65,65),
    (34,34,75,75),
    (35,35,55,55),
    (36,36,100,100),
    (37,37,45,45),
    (38,38,35,35),
    (39,39,25,25),
    (40,40,15,15),
    (41,41,85,85),
    (42,42,95,95),
    (43,43,65,65),
    (44,44,75,75),
    (45,45,55,55),
    (46,46,100,100),
    (47,47,45,45),
    (48,48,35,35),
    (49,49,25,25),
    (50,50,110,110)
]

for st in inventory_data:
    inventory_obj = Inventory(id=st[0], book_id=st[1], total_stock=st[2], available_stock=st[3])
    session.merge(inventory_obj)

# 7. Chèn dữ liệu vào bảng readers
# readers_data = [
#     (1,"alice@example.com",5,"alice","Password@123","USER"),
#     (2,"bob@example.com",3,"bob","Password@123","USER"),
#     (3,"charlie@example.com",4,"charlie","Password@123","USER"),
#     (4,"diana@example.com",2,"diana","Password@123","USER"),
#     (5,"eric@example.com",6,"eric","Password@123","USER"),
#     (6,"fiona@example.com",7,"fiona","Password@123","USER"),
#     (7,"george@example.com",5,"george","Password@123","USER"),
#     (8,"helen@example.com",3,"helen","Password@123","USER"),
#     (9,"ian@example.com",4,"ian","Password@123","USER"),
#     (10,"julia@example.com",2,"julia","Password@123","USER"),
#     (11,"karen@example.com",5,"karen","Password@123","USER"),
#     (12,"leo@example.com",3,"leo","Password@123","USER"),
#     (13,"mona@example.com",4,"mona","Password@123","USER"),
#     (14,"nate@example.com",2,"nate","Password@123","USER"),
#     (15,"olivia@example.com",6,"olivia","Password@123","USER"),
#     (16,"peter@example.com",7,"peter","Password@123","USER"),
#     (17,"quincy@example.com",5,"quincy","Password@123","USER"),
#     (18,"rachel@example.com",3,"rachel","Password@123","USER"),
#     (19,"sam@example.com",4,"sam","Password@123","USER"),
#     (20,"tina@example.com",2,"tina","Password@123","USER")
# ]

# for user in readers_data:
#     reader_obj = Reader(
#         id=user[0],
#         contact_info=user[1],
#         quota=user[2],
#         username=user[3],
#         password=user[4],
#         role=user[5]
#     )
#     session.merge(reader_obj)

# # 8. Chèn dữ liệu vào bảng borrowings
# borrowings_data = [
#     (1,1,1,"2024-03-01","2024-03-15","2024-03-14","DANG_MUON"),
#     (2,2,2,"2024-03-02","2024-03-16","2024-03-16","DA_TRA"),
#     (3,3,3,"2024-03-03","2024-03-17",None,"QUA_HAN"),
#     (4,4,4,"2024-03-04","2024-03-18","2024-03-18","DA_TRA"),
#     (5,5,5,"2024-03-05","2024-03-19",None,"QUA_HAN"),
#     (6,6,6,"2024-03-06","2024-03-20","2024-03-20","DA_TRA"),
#     (7,7,7,"2024-03-07","2024-03-21",None,"DANG_MUON"),
#     (8,8,8,"2024-03-08","2024-03-22","2024-03-22","DA_TRA"),
#     (9,9,9,"2024-03-09","2024-03-23",None,"QUA_HAN"),
#     (10,10,10,"2024-03-10","2024-03-24","2024-03-24","DA_TRA"),
#     (11,11,11,"2024-03-11","2024-03-25",None,"DANG_MUON"),
#     (12,12,12,"2024-03-12","2024-03-26","2024-03-26","DA_TRA"),
#     (13,13,13,"2024-03-13","2024-03-27",None,"QUA_HAN"),
#     (14,14,14,"2024-03-14","2024-03-28","2024-03-28","DA_TRA"),
#     (15,15,15,"2024-03-15","2024-03-29",None,"DANG_MUON"),
#     (16,16,16,"2024-03-16","2024-03-30","2024-03-30","DA_TRA"),
#     (17,17,17,"2024-03-17","2024-03-31",None,"QUA_HAN"),
#     (18,18,18,"2024-03-18","2024-04-01","2024-04-01","DA_TRA"),
#     (19,19,19,"2024-03-19","2024-04-02",None,"DANG_MUON"),
#     (20,20,20,"2024-03-20","2024-04-03","2024-04-03","DA_TRA")
# ]

# for br in borrowings_data:
#     borrow_date = pd.to_datetime(br[3]).date()
#     return_date = pd.to_datetime(br[4]).date()
#     actual_return_date = pd.to_datetime(br[5]).date() if br[5] else None

#     borrowing_obj = Borrowing(
#         id=br[0],
#         reader_id=br[1],
#         book_id=br[2],
#         borrow_date=borrow_date,
#         return_date=return_date,
#         actual_return_date=actual_return_date,
#         status=br[6]
#     )
#     session.merge(borrowing_obj)

# Lưu các thay đổi
session.commit()

# Đóng session
session.close()

print("Dữ liệu đã được nhập thành công vào cơ sở dữ liệu PostgreSQL!")
