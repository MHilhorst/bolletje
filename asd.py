
x = {'test1.txt': {'aap': 1, 'noot': 1, 'mies': 1},
     'test2.txt': {'aap': 1, 'noot': 1},
     'test3.txt': {'aap': 1, 'mies': 2},
     'test4.txt': {'aap': 1, 'mies': 1, 'wim': 1}}


[['', 'test1.txt', 'test2.txt', 'test3.txt', 'test4.txt'],
 ['mies', 1, 0, 2, 1],
 ['aap', 1, 1, 1, 1],
 ['noot', 1, 1, 0, 0],
 ['wim', 0, 0, 0, 1]]

mies = ['mies']
app = ['aap']
noot = ['noot']
wim = ['wim']
for i in x:
    print(i)
    for item in x[i]:
        print(item)
        print
