content = open('src/components/ChatBot.jsx').read()
old = 'className=`flex ${msg.type === '
new = 'className={`flex ${msg.type === '
content = content.replace(old, new)
old2 = "'justify-start'}`}"
new2 = "'justify-start'}`}"
content = content.replace(old2, new2)
open('src/components/ChatBot.jsx', 'w').write(content)
print("Done")
