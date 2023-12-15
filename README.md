# transcendence

## 사전 준비
- .env 파일이 필요합니다
	- root 디렉토리에 .env 파일을 생성하고, 필요한 값을 작성합니다.
	- slack 방 등에 올려진 env를 참조해주세요

## 실행하기
```shell

# 처음 실행 할 경우
$ make

# 빌드만 하고 싶을 경우
$ make build

# 이미 빌드가 된 상태에서 컨테이너만 띄울 겅우
$ make up

# 컨테이너들을 내리고 싶을 경우
$ make down

# 컨테이너들을 내리고 volume을 없애고 싶을 경우
$ make clean

# 컨테이너, volume, 이미지 모두 없애고 싶을 경우
$ make fclean

# 컨테이너, volume까지만 없애고 다시 시작하고 싶은 경우
$ make re

# 컨테이너, volume, 이미지 모두 없애고 다시 시작하고 싶은 경우
$ make fre

```
