~~ diffie-hellman ~~
shared secret over public channel

alice and bob agree publicly on prime p and primitive root g
alice chooses private random number a and computes A = g^a mod p and sends bob A
bob chooses private random number b and computes B = g^b mod p and sends alice B
alice computes secret value s = B^a mod p
bob computes secret value s = A^b mod p

p=23,g=5
a=4,A=5^4 mod 23=4
b=3,B=5^3 mod 23=10
alice_secret=10^4 mod 23=18
bob_secret=4^3 mod 23=18

