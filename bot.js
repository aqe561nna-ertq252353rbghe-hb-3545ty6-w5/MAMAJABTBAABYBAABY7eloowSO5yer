const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const sql = require('sqlite');
sql.open("./botslist.sqlite")
const helpers = JSON.parse(fs.readFileSync("./helpers.json", "utf8"));


let prefix = '/',
    prefix2 = '/'
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  if (msg.content === prefix + 'ping') {
    msg.channel.send('Pinging...').then(sent => {
      sent.edit(`Pong! Took ${sent.createdTimestamp - msg.createdTimestamp}ms`);
  });
  }
    
  let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(prefix.length)

  let args = msg.content.split(" ").slice(1);

  if (command == 'apply' || command == 'تقديم') {
    if (msg.member.roles.has('488071969074446346')) return msg.reply(`انت مقدم بالفعل`)
    if (msg.channel.id !== '488069462705045518') return msg.reply(`لا يمكنك التقديم هنا توجه الى روم \n\ <#488069462705045518>`)
    let message = msg;
    if (!args[0]) return msg.reply(`رجاء ادخل بريفكس البوت و رابط الدعوة و المميزات`)
     let answer = args.join(" ")
          msg.reply(`تقديمك يعني موافقتك على الشروط الآتية
          - يجب ان يكون بوتك خالي من الاشياء الاباحيه
          - يجب ان لايحتوي على روابط تهكير او اخافة الاشخاص
          - عدم استعمال خاصية البرودكاست 
          - يجب ان تكون عربياً 
          -يجب ان يكون بوتك يشتغل 24 ساعة 
          ✅ | موافق ومعي اياها كلها
          ❎ | لا يبوي كنسل .. شروطكم صعبة
          `).then(m => {
            m.react('✅')
            m.react('❎')
            m.awaitReactions((reaction, user) => user.id == msg.author.id, {time: 60000, maxEmojis: 1})
            .then(result => {
              var reaction = result.firstKey();
             if (reaction == '✅' || reaction == '❎') {
               if (reaction == '✅') {
               msg.reply(`لقد تم تقديمك
               تقديمك لا يعني بالضرورة قبولك
               
               في حال ادخال معلومات غير صحيحة .. سوف يتم عقابك
               `)
               msg.member.addRole('443324027046723585').catch(console.error);
               msg.guild.channels.get('443315685968314369').send(`
               تقديم جديد
               \`المقدم\`
               <@!${msg.author.id}> 
                 \` معلومات التقديم \`
                 ${args.join(" ")}
                 ------------------
                 للقبول
                 $accept <@!${msg.author.id}>
               `).then(m => {
                 m.react('✅')
                 m.react('❎')
                 m.awaitReactions((reaction, user) => user.id == msg.author.id, {maxEmojis: 1})
                 .then(result => {
                  var reaction = result.firstKey();
                 if (reaction == '✅') {
                   msg.member.addRole('442754183309950987')
                   msg.guild.channels.get('443315685968314369').send(`Done .. `)
                   msg.member.send(`
                   مبروووووووووووووووووووك
                   لقد تم قبولك الان انت ديفلوبر 
                   وبوتك بالسيرفر
                   `)
                 }
                 if (reaction == '❎') {
                   m.delete();
                 }
                 });
               })
               }
               if (reaction == '❎') {
                 msg.reply(`لقد تم كنسل تقديمك .. `).then(m => m.delete(5000))
                 msg.delete();
               }
               
             }
            });
          })
        }
        let ownerrole = msg.guild.roles.find('name', 'THE BOSS');
        if (command == 'accept') {
          if (!msg.member.roles.has(ownerrole)) return;
          let person = msg.mentions.members.first()
          if (!person) return msg.reply(`عليك بمنشن احد الاشخاص`)
          if (!person.roles.has('443324027046723585')) return msg.reply(`هذا الشخص ليس مقدم`)
          msg.reply(`تم قبول الشخص بنجاح`)
          person.addRole('442754183309950987').catch(console.error);
        }
        if (command == 'add') {
        if (!msg.member.hasPermission("MANAGE_GUILD")) return;
        let botname = args[0];
        let botprefix = args[1];
        if (!botname) return msg.reply(`ادخل اسم البوت`)
        if (!botprefix) return msg.reply(`ادخل البريفكس`)
        var filter = m => m.author === msg.author
        msg.reply(`ادخل بعض مميزات البوت`)
        msg.channel.awaitMessages(filter, { maxMatches: 1, time: 60000, errors: ['time'] })
          .then(collected => {
            let botfeatures = collected.first().content;
        sql.get(`SELECT * FROM botslist WHERE botname = "${botname}" AND guildId = "${msg.guild.id}"`).then(row => {
          if (!row) {
              msg.reply(`تم الإضافة بنجاح`)
              sql.run("INSERT INTO botslist (botname, botprefix, botf, guildId) VALUES (?, ?, ?, ?)", [botname, botprefix, botfeatures, msg.guild.id]);
          }
          if (row) {
            
              return msg.reply(`موجود بالفعل`)
          }
        }).catch(() => {
          console.error;
          sql.run("CREATE TABLE IF NOT EXISTS botslist (botname TEXT, botprefix TEXT, botf TEXT, guildId)").then(() => {
            sql.run("INSERT INTO botslist (botname, botprefix, botf, guildId) VALUES (?, ?, ?, ?)", [botname, botprefix, botfeatures, msg.guild.id]);
            msg.reply(`تم إضافة البوت بنجاح`)
          });
      })
    }).catch(collected => {
      msg.reply(`Time Ended .. Go ..`)
    })
        }
        if (msg.content === prefix2 + `bots`) {
          sql.all(`SELECT * FROM botslist WHERE guildId = "${msg.guild.id}" ORDER BY botname`).then(rows => {
            
            let cmdslist = rows.map((row) =>`اسم البوت :**${row.botname}** \n\  البريفكس :  \`\`${row.botprefix}\`\` \n\  المميزات : ${row.botf}\n\ ----------------------`).join("\n")
           msg.channel.send({
               embed: {
                   title: "البوتات الموجودة",
                   color: 3447003,
                   description: cmdslist
              }
           });
          });
        }
        if (command == `delete`) {
          if (!msg.member.hasPermission("MANAGE_GUILD")) return;
      sql.get(`SELECT * FROM botslist WHERE botname = "${args.join(" ")}" AND guildId = "${msg.guild.id}"`).then(row => {
        if (!row) { msg.reply(`خطأ : لم اجد البوت المطلوب`)}
        if (row) {
        sql.run(`DELETE FROM botslist WHERE guildId = "${msg.guild.id}" AND botname = "${args.join(" ")}"`)
        msg.reply(`تم الحذف بنجاح`)
        }})
        }
        if (command == 'deleteall') {
          if (!msg.member.hasPermission("MANAGE_GUILD")) return;
          sql.run(`DELETE FROM botslist WHERE guildId = "${msg.guild.id}"`)
          msg.reply(`تم حذف كل البوتات بنجاح`)
        }
        if (command == 'bot') {
        sql.get(`SELECT * FROM botslist WHERE botname = "${args.join(" ")}" AND guildId = "${msg.guild.id}"`).then(row => {
          if (!row) { msg.reply(`خطأ : لم اجد البوت المطلوب`)}
          if (row) {
            let embed = new Discord.RichEmbed()
            .setTitle(`${row.botname}`)
            .addField(`البريفكس : `, `${row.botprefix}`)
            .addField(`المميزات`, `${row.botf}`)
            .setThumbnail(msg.guild.iconURL)
            .setColor('RANDOM')
            msg.channel.send(embed);
          }        
        })
        }
        if (command == 'helper') {
          if (helpers[msg.author.id]) return msg.reply(`انت مقدم بالفعل`)
          msg.reply(`تقديمك لمساعد في السيرفر يعني : 

          \`1\` - معرفة استخدامك للاوامر الانجليزية
          \`2-\` - التزامك بالقوانين 
          \`3-\` - تفاعلك بالسيرفر

          ✅ | موافق وقدام
          ❎ | لا يبوي هونت
          `).then(m => {
            m.react('✅')
            m.react('❎')
            m.awaitReactions((reaction, user) => user.id == msg.author.id, {maxEmojis: 1})
                 .then(result => {
                  var reaction = result.firstKey();
                  if (reaction == '✅') {
                    let user = msg.member.user,member = msg.member;

                  let embed = new Discord.RichEmbed()
                  .setTitle(`تقديم مساعدة !`)
                  .addField(`معلومات المقدم : `, `
                  اسم المقدم : **${user}**
                  رتبة المقدم : **${member.highestRole}**
                  الايدي : **${user.id}**
                  `)
                  client.channels.get('443657914666844170').send(embed);
                  msg.reply(`لقد تم تقديمك .. تقديمك لا يعني بالضرورة قبولك \n\ شكرًا لتقديمك`)
                  if (!helpers[msg.author.id]) helpers[msg.author.id] = {}
                  fs.writeFile("./helpers.json", JSON.stringify (helpers), (err) => {
                    if (err) console.error(err)
                  });

                  }
                  if (reaction == '❎') {
                   return msg.reply(`تم الكنسل بنجاح`)
                  }
                 })
          })
        }
      if (command == 'kick') {
        if (!msg.member.hasPermission("MANAGE_GUILD")) return;
        let person = msg.mentions.members.first()
        if (!person) return msg.reply(`امممم .. منشن احد الاشخاص`)
        if (person.kickable) {
          person.kick().catch(console.error);
        }
        if (!person.kickable) return msg.reply(`ما اقدر اطرد الحب ذا....`)
      }
});
let log = client.channels.get('443674924679168011');
client.on('messageDelete', message => {
  let guild = message.guild;
  let contentofdeleted = message.cleanContent;
  let user = message.member.user;
  let embed = new Discord.RichEmbed()
  .setTitle(`لوق جديد !`)
  .addField(`اللوق : `, `♻ حذف رسالة`)
  .addField(`المرسل : `, `${user.tag} \n\ ${user.id}`)
  .addField(`الرسالة : `, `${contentofdeleted}`)
  .setColor('BLACK')
  .setThumbnail(user.avatarURL)
  if (log) {log.send(embed)}
});
client.on("guildBanAdd", (guild,user) => {
  let embed = new Discord.RichEmbed()
  .setTitle(`لوق جديد`)
  .addField(`اللوق : `, `باند`)
  .setColor('RANDOM')
  .addField(`الشخص : `, `${user.tag} \n\ ${user.id}`)
  if (log) {log.send(embed)}
})
client.on("guildBanRemove", (guild,user) => {
  let embed = new Discord.RichEmbed()
  .setTitle(`لوق جديد`)
  .addField(`اللوق : `, `فك الباند`)
  .setColor('RANDOM')
  .addField(`تم فك الباند من : `, `${user.tag} \n\ ${user.id}`)
  if (log) {log.send(embed)}
})
client.on("roleCreate", role => {
  let embed = new Discord.RichEmbed()
  .setTitle(`لوق جديد`)
  .addField(`اللوق : `, `انشاء رتبة`)
  .addField(`معلومات الرتبة : `, `اسم الرتبة : **${role.name}** \n\ لون الرتبة : **${role.color}** \n\ ايدي الرتبة : **${role.id}**`)
  .addField(`البرمشنات : `, `${role.permissions}`)
  .setColor('RANDOM')
  if (log) {log.send(embed)}
})

client.login(process.env.BOT_TOKEN);
