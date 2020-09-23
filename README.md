## Express와 mysql을 사용한 login, CRUD 기능 구현

Passport을 사용하여 로그인 기능을 구현하였음<br>
Mysql 데이터 베이스를 사용하였고, Id와 비밀번호만 입력해 회원가입

## 비밀번호를 암호화해 데이터베이스에 저장

회원가입시 생성한 비밀번호를 bcryptjs를 통해 암호화 하여 데이터베이스에 저장<br>
<img src="/pictures/bcrypt.PNG">
