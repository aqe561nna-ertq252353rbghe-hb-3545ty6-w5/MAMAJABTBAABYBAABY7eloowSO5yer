const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "/"


client.on('ready', ready => {
  console.log('ready')
  client.user.setStatus('dnd', 'Alpha Bots!')
  client.user.setGame('Alpha Bots!')
})

client.on('message',async message => {
    if(message.content.startsWith(prefix + "تقديم")) {
  if(!message.channel.guild) return message.reply(' ');
    let acapply = message.guild.channels.find(`name`, "تقديمات");
    if(!acapply) return message.channel.send(":x: لم اجد روم التقديمات");
      let filter = m => m.author.id === message.author.id;
      let id;
      let thisFalse;
      message.channel.send(':pencil: **| من فضلك اكتب اي دي بوتك الأن... :pencil2: **').then(msg => {
  
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 90000,
        errors: ['time']
      })
      .then(collected => {
        collected.first().delete();
        id = collected.first().content;
        let prefox;
        msg.edit(':scroll: **| من فضلك اكتب برفكس بوتك الأن... :pencil2: **').then(msg => {
  
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 90000,
              errors: ['time']
            })
            .then(collected => {
              collected.first().delete();
              prefox = collected.first().content;
        let mwa9fat;
        msg.edit(':scroll: **| من فضلك اكتب مواصفات بوتك الأن... :pencil2: **').then(msg => {
  
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 90000,
              errors: ['time']
            })
            .then(collected => {
              collected.first().delete();
              mwa9fat = collected.first().content;
              let count;
              msg.edit(':man_in_tuxedo: **| من فضلك اكتب عدد سيرفرات ومستخدمين بوتك الأن... :pencil2: **').then(msg => {
  
                message.channel.awaitMessages(filter, {
                  max: 1,
                  time: 90000,
                  errors: ['time']
                })
                .then(collected => {
                  collected.first().delete();
                count = collected.first().content;
        msg.edit(':shield: **| [ هل قرأت شروط التقديم؟ للموافقة على الشروط اكتب [ نعم ] او [ لا**');
   message.channel.awaitMessages(response => response.content === 'نعم' || 'لا' && filter,{
          max: 1,
          time: 90000,
          errors: ['time']
        })
        .then(collected => {
          if(collected.first().content === 'لا') {
            msg.delete();
            message.delete();
            thisFalse = false;
          } // ${id} for bot id // ${mwa9fat} for bot features // ${count} for server and member count
          if(collected.first().content === 'نعم') {
            if(thisFalse === false) return;
            msg.edit(':white_check_mark: | **تم التقديم بنجاح**.');
            collected.first().delete();
           let embed = new Discord.RichEmbed()
        .setColor('#4CE782')
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(message.author.avatarURL)
        .setTitle('تقديم جديد :')
        .setDescription(`
**# - اي دي البوت** :
\`${id}\`
**# - بريفكس البوت** :
\`${prefox}\`
**# - عدد السيرفرات والمستخدمين** :
\`${count}\`
`)
.addField('مواصفات البوت :', mwa9fat)
.setFooter(message.author.username, message.author.avatarURL)
.setTimestamp()     
acapply.send(embed)
          }
        }
    );
});
      });
    }
      );
    });
}
);
})
}
      )
      }
      )
    }
}
)



client.login(process.env.BOT_TOKEN);
