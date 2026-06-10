import React, { useEffect, useState, useRef } from 'react';
import { ScrollNavbar } from '../components/ScrollNavbar';
import { jsPDF } from 'jspdf';

interface PageSection {
    id: number;
    type: 'cover' | 'quote' | 'introduction' | 'narrative';
    title?: string;
    subtitle?: string;
    content?: string[];
    quote?: string[];
    hasImage?: boolean;
    imagePosition?: 'left' | 'right';
    imagePlaceholder?: string;
}

// Autobiography sections data - extracted word-for-word from the PDF images
const AUTOBIOGRAPHY_SECTIONS: PageSection[] = [
    {
        id: 1,
        type: 'cover',
        title: 'My Autobiography',
        subtitle: 'by  --Ritesh--',
    },
    {
        id: 2,
        type: 'quote',
        title: 'Zindagi ke Safar Ka Aarambh',
        quote: [
            '"Kuch kahaniyaan sirf sunaayi nahi jaati... mehsoos ki jaati hain.',
            'Kuch yaadein sirf beet nahi jaati... zinda rehti hain har pal mein.',
            'Aur kuch safar... shuru hote hain ek chhoti si jagah se, lekin le jaate hain aakash tak..."',
        ],
    },
    {
        id: 3,
        type: 'introduction',
        title: 'Introduction',
        hasImage: true,
        imagePosition: 'left',
        imagePlaceholder: 'Photo of childhood home',
        content: [
            '"Mera naam Ritesh hai.',
            'Main Mohiguda ke chhote gaav se hoon, lekin meri soch kabhi chhoti nahi rahi.',
            'Parivaar ne mujhe sanskaar bhi diye aur bade sapne dekhne ki himmat bhi.',
            'Yeh kahani sirf meri nahi, har us insaan ki hai jo gareebi ke andhere mein bhi apne sapno ka ujala dhoondta hai.',
            'Main sirf ek ladka nahi hoon—',
            'Main ek junoon hoon, ek mission hoon, ek kahani hoon jisme har page ek naya motivation hai.',
            'Har girna ek sabak tha, har subah ek naya mauka.',
            'Aur mera hero banne ka safar shuru hota hai ek school ke bench se."',
        ],
    },
    {
        id: 4,
        type: 'narrative',
        title: "The Meaning of My Life's Journey",
        content: [
            'Thank you Almighty for creating me, for guiding me through every phase of life, and for giving me a purpose in this world.',
            '',
            'To me, life is not just a journey — it is an endless destination with infinite stoppages. And it is entirely your choice where you wish to pause, reflect, and move forward.',
            '',
            '"This is the story of my journey so far — one shaped by love, struggles, dreams, and divine blessings."',
            'Even before I was born , I had already won my first race — a race where millions participated, but only I could reach the finish line and got first position. And that victory allowed me to be here today ,writing my own autobiography-the story of a life that began with determination, even before birth.',
        ],
    },
    {
        id: 5,
        type: 'narrative',
        title: 'The Night of Eleven Smiles',
        content: [
            'The night was calm, the sky painted with stars, and the dim yellow bulb in our old living room flickered like it was part of our laughter. That evening, all eleven of us — five brothers and six sisters — sat on the cool cement floor, excitedly preparing for our favourite game:',
            'King, Queen, Minister, Thief, and Police.',
            'Torn bits of paper were passed around secretly, each one hiding a royal or rebellious fate. The room echoed with giggles, suspicious glances, and playful accusations. But amidst all the fun, one face always smiled a little extra — our eldest sister.',
            'She had a secret.',
            'While we were busy folding papers, she would cleverly mark the paper that had "King" written on it — maybe a small dot, a tiny line, or a folded corner only she knew. When it came time to throw the papers on the floor and grab one randomly, her hands would somehow always find that marked piece.',
            '"I\'m the King again!" she\'d shout with a sparkle in her eyes and a mischievous grin.',
            'At first, we thought it was luck. Then we started noticing... her "luck" never ran out.',
            'But did we mind? Not really. Because in that moment — in that room filled with laughter, innocent cheating, and the joy of being together — we were all kings and queens of our little world.',
        ],
    },
    {
        id: 6,
        type: 'narrative',
        title: 'The Night That Still Lives Within Me',
        content: [
            '"If I could go back and relive just one evening of my childhood, it would be that one — where love, laughter, and paper crowns ruled the night."',
            '',
            '"That was just one of the many memories that shaped my childhood — simple moments, yet so unforgettable. But every beginning has a deeper story. So now, let me take you to the very start of my life..."',
        ],
    },
    {
        id: 7,
        type: 'introduction',
        title: 'From Silence to Sound',
        hasImage: true,
        imagePosition: 'right',
        imagePlaceholder: 'Baby photo',
        content: [
            'I don\'t remember how my infant days truly were — the way I looked, cried, or smiled. But what I know today is what my mother told me. Her voice still trembles a little when she narrates those memories.',
            'I was born on the 8th of March, 2006, in Mohiguda village. But unlike most babies who cry at birth, I didn\'t. Not a single sound came out of me. For an entire day, there was only silence. It was only after 24 hours that I cried for the first time — and in that single cry, my mother says, her heart finally felt alive.',
        ],
    },
    {
        id: 8,
        type: 'narrative',
        title: '',
        content: [
            'And that was not the only divine challenge. Even after two years had passed, I had not spoken a single word. I couldn\'t say "maa" or "baba." My parents grew worried, but they didn\'t give up — especially my maa.',
            'Every year, she would observe the Samba Dashami — a sacred Odia festival where mothers worship Lord Surya, the Sun God, praying for their child\'s health and voice. She did it not once, but again and again, year after year.',
            'During those rituals, she performed "Muduku Puja" — a prayer ceremony especially for children who couldn\'t speak. She also prayed for my teeth to appear by offering roasted chickpeas (chana) as part of the puja. Even today, she continues this ritual out of love and gratitude.',
            'She told me something else, too — whenever I cried as a baby, I wouldn\'t stop easily. My tears would flow endlessly, as if my silence was being released through them.',
            'And then, slowly, I began to grow — watched closely by the eyes that loved me the most.',
        ],
    },
    {
        id: 9,
        type: 'narrative',
        title: 'Waqt Aur Main',
        content: [
            '"Zindagi ke panno par likhi ja rahi thi ek kahani...',
            'Jisme har chapter ek nayi seekh, ek naya jazba tha.',
            'Anganwadi tak ki yaadein jaise ek gulmohar ke phool the – chhoti si muskaan, aur thoda sa dard.',
            'Par ab waqt tha agle mod pe kadam rakhne ka...',
            'Jahan 1st standard ke din, meri duniya ko naye rangon se bharne wale the.',
            'Naaye dost, naaye kisse, naaye pal...',
            'Aur unmein chhupi thi wo chingari, jo meri rooh ko roshan karti chali gayi..."',
            '',
            '"Waqt aage badhta gaya... aur main bhi."',
            'Maa ke sanskaron, poojaon aur prem se palta-badha main, dheere-dheere apni duniya samajhne laga.',
            'Rona, hansna, bolna, sab seekha – maa ke haathon se, parwa se, aur unke ashruon se jo har dua me mere liye girte the.',
        ],
    },
    {
        id: 10,
        type: 'narrative',
        title: 'When Alphabets Became Blessings',
        content: [
            'It was on Shree Panchami, the holy day dedicated to Goddess Saraswati and Lord Ganesha, that I held a chalk and a small blackboard for the first time. I joined my hands in prayer and wrote my first letters: "ଓ", "ଅ", "ଆ"... The journey of learning had begun. That day, I may have written letters... but truly, I had started writing my life\'s story.Wahi se shuru hua ek student ka safar, jiska destination to abhi bhi likha jaa raha hai...',
            'Lekin har padhaav, har class, har kitaab – ek kahaani ban gayi.',
            'Toh chaliye... ab main le chalta hoon aapko meri school life ki galiyon me, jahan pehli baar main ne sapne dekhna shuru kiya.',
        ],
    },
    {
        id: 11,
        type: 'narrative',
        title: 'When Mischief Met Innocence',
        content: [
            'Soon, I stepped into Standard 1 at Primary School, Mohiguda, right in my own village. Life was simple, beautiful, and magical.',
            'Every day was an adventure. Sometimes I\'d run to school while playing, and if I spotted a frog, a snake, or even a bug on the way — oh boy! I\'d happily try to catch it and race after it as if it were a prize. I loved the rains the most — I\'d make paper boats, place them in muddy water, and sing joyfully:',
            '"କା ରେ ତଗୋ ଭସିଯା, ନିଙ୍କୁ ନାହିଁ ବୁଡ଼ିବୁ ନାହିଁ, ଆଗକୁ ଚାଲିଯିବୁ।"',
            'I was a quiet mastermind. I rarely did mischief directly — instead, I convinced my friends to do it for me. But no matter how secret the plan was, somehow everyone would find out I was the one behind it. My legend was slowly taking shape...',
            'As I moved up to 2nd and 3rd standard, I started becoming smarter — maybe even a bit too clever. I began thinking for myself, making decisions, and exploring new ways to outwit the world. And oh, here\'s my favorite story:',
        ],
    },
    {
        id: 12,
        type: 'narrative',
        title: 'Food Vanishing Aur Jadui Glass',
        content: [
            'One day, my mummy was feeding me lunch. But my little brain had other ideas — I wasn\'t in the mood to eat at all. So I cooked up a mini strategy...',
            'I asked her sweetly for a glass of water and waited for the moment. As she fed me, I took the bite, pretended to chew, then slyly spit the food into the half-filled water glass. Slowly, the food inside the glass piled up — and soon, the plate was empty. Mummy beamed with joy, thinking, "Mera beta sab kuch kha gaya!"',
            'But her joy didn\'t last long. When she saw the glass full of soggy food, she stared at me in disbelief. Her happiness turned into strict maa-mode and she said, "Ab se khaane ke time paani bhi nahi dungi!"',
            'That day I learned something legendary:',
            'No child can outsmart a mother.',
            'Even Lord Krishna couldn\'t hide butter from Yashoda Maiya — every time, he got caught. So how could I?',
        ],
    },
    {
        id: 13,
        type: 'narrative',
        title: 'Aaishi Mantra, Phaishi Mantra: Tales of a Stick',
        content: [
            'The Panch Pandavas of Our Home – A Childhood Tale of Mischief, Magic, and Memories.',
            'During my childhood, I shared a home with four other brothers — two of them my own younger siblings, and the other two, the sons of my father\'s brother. Together, we were famously known in our village as the "Panch Pandav", the five warriors — not for our valor, but for our unending mischief.',
            'Being the eldest among the five, I naturally became the "chief mischief architect." Our innocent chaos was often too much for the elders to handle. So, our grandfather, both wise and witty, crafted a solution — a sturdy bamboo stick (which we called baadi in Odia). He shaped it with great precision, polishing it until it resembled a magical staff straight out of folklore.',
            'He would often warn us with his theatrical chant:',
            '"Aaishi mantra phaishi mantra pithau mantra, juaani ja gandi ku bajiba gani gani!"',
        ],
    },
    {
        id: 14,
        type: 'narrative',
        title: '',
        content: [
            'And just like that — we\'d freeze, eyes wide, heart pounding — and instantly behave like saints!',
            'Whenever we got scared, especially after hearing the "mantra," we would quietly run to our grandmother and beg her to protect us.',
            'And oh, how lovingly she would shield us with her stories — each time a new one, filled with warmth, wisdom, and wonder.',
        ],
    },
    {
        id: 15,
        type: 'narrative',
        title: 'Under the Mattress of Fear',
        content: [
            'One evening, there was a feast (bhoji) in the village. All the elders left, instructing us to stay indoors, play calmly, and sleep early.',
            'We were five brave warriors, or so we thought... until darkness crept in.',
            'One corner of the house was unusually dark — so ominous that our courage melted away. We panicked and huddled under a mattress cover like frightened mice, all five of us squashed and breathless but too scared to come out. The fear made us forget even the space crunch!',
            '',
            'Even now, that night remains crystal clear in my memory — a perfect blend of childhood thrill, terror, and sibling bonding.',
        ],
    },
    {
        id: 16,
        type: 'narrative',
        title: 'Masoomiyat se Umeedon Tak',
        content: [
            '"Har bachpan ka ek rang hota hai,',
            'kisi ke liye khel-kood,',
            'kisi ke liye sapne,',
            'aur mere liye... ek chhota sa aangan jahan khushiyo ka mela lagta tha.',
            'Na jaane kitni baar maine mitti ke ghar banaye,',
            'aur hawa ke saath unhe bikharte dekha.',
            'Par shayad wahi pal,',
            'mujhe sikhate rahe ki zindagi bhi aise hi hai—',
            'giregi, bikhar jaayegi,',
            'par har baar ek naya ghar banega,',
            'ek nayi kahani shuru hogi.',
            'Aur fir... aaya 4th standard—',
            'ek nayi kitaab ka pehla panna,',
            'jahan bachpan ka rang badal kar',
            'progress ki kahani likhna shuru hua."',
        ],
    },
    {
        id: 17,
        type: 'narrative',
        title: 'The Night I Was Lost',
        content: [
            'When I was in 4th standard, one day I went to my maternal grandfather\'s house.',
            'That day, near my grandfather\'s crop field, there was a threshing floor where everyone was processing the paddy harvested from the fields.',
            'I also went along with them.',
            '',
            'But after some time, I started feeling sleepy, so I went into a thatched hut nearby and fell asleep.',
            'As evening deepened, everyone finished their work and went home.',
            'No one remembered that I had fallen asleep there, and slowly, night came.',
            'At home, everyone began searching for me, but they couldn\'t find me because I was sleeping deeply inside that thatched hut.',
            'After that, the whole village started searching for me, but still, no one could find me.',
            'A little later, my father, grandfather, and grandmother all came to my maternal grandfather\'s house.',
            'A heated argument broke out among everyone — "You have lost my child!"',
        ],
    },
    {
        id: 18,
        type: 'narrative',
        title: '',
        content: [
            'After some time, I woke up and saw that it was already very late at night.',
            'All around me there was only darkness — not a single person nearby.',
            'I got really scared and started shivering with fear.',
            '',
            'Meanwhile, at home, someone suddenly remembered that I had gone to the threshing floor.',
            'So my grandfather himself came to get me, and I finally went home — but I was still extremely frightened.',
            '',
            'Even today, everyone says that I was "lost" in my childhood.',
            'And honestly, whenever I remember all of it, I feel both amazed and amused.',
        ],
    },
    {
        id: 19,
        type: 'narrative',
        title: 'Jhilmilati Pratibhaon Ka Saal',
        content: [
            'In this way, my 4th standard came to an end, and with a mixture of excitement and curiosity, I stepped into the 5th standard. This was not just a promotion to the next class, but for me, it marked the beginning of a new aura in life. I started participating in almost every competition in school — whether it was a drawing contest, singing performance, debate, or any cultural program. My two major strengths were singing and drawing. Singing was not merely an activity for me; it was my way of expressing emotions. Drawing, on the other hand, felt like magic flowing through my fingers onto paper. Whether it was Independence Day, Republic Day, Teacher\'s Day, or any other school celebration, my presence on stage became almost guaranteed. In drawing, I consistently secured the first position, and in singing, I often came first or second. Even in debates, I made sure my voice was heard and my points were clear.',
        ],
    },
    {
        id: 20,
        type: 'narrative',
        title: '',
        content: [
            'During this year, I also started preparing for the Navodaya Vidyalaya entrance exam. It was a dream for many students of my age, and I worked tirelessly for it. Whether sitting on a school bench, studying in the courtyard at home, or memorizing formulas while helping in the vegetable field, I gave my best. My maternal grandfather, a retired headmaster, personally guided me. His words, "Padhaai ko sirf marks ke liye mat padh, beta... yeh tujhe insaan banane ka zariya hai," still echo in my mind. Despite my dedication, I couldn\'t clear the exam that year. Yes, it hurt, but I refused to let the failure define me. I treated it as just a small hurdle in a much longer journey.',
        ],
    },
    {
        id: 21,
        type: 'introduction',
        title: 'Goodbye, Little Lion',
        hasImage: true,
        imagePosition: 'left',
        imagePlaceholder: 'Lion toy image',
        content: [
            'One memorable incident from this time was the arrival of a tiny rubber lion in my life. It was just a small keychain toy, but to me, it was no less than a living friend. I proudly took it to school, and my classmates were instantly fascinated. We even made a small paper house for it, pretended to feed it, and sometimes "took it for a walk" around the classroom. It became our unofficial class pet. However, one day during recess, it mysteriously disappeared. We searched every bench, corner, and desk, but it was nowhere to be found. Heartbroken, we decided to treat the loss seriously and held a symbolic "farewell" for it.Behind the school, there was a small river where we went, splashed in the water, and let go of our little friend. Even today, I smile at the thought of how something so small could hold such an important place in our childhood hearts.',
        ],
    },
    {
        id: 22,
        type: 'narrative',
        title: 'Every Reader is a Dreamer',
        content: [
            'This is not only my journey...',
            'It is yours too.',
            'The struggles you faced,',
            'the dreams you hide,',
            'the hopes you carry —',
            'they all walk with me here.',
            'Every page you read is a mirror,',
            'showing your own courage, your own fire.',
            'So don\'t just read my story...',
            'Live yours.',
            'Because the hero of this book is not me alone —',
            'it\'s you who dares to dream ahead.',
        ],
    },
    {
        id: 23,
        type: 'narrative',
        title: 'Nanaji\'s Home, A School of Dreams',
        content: [
            'After completing 5th standard, a big change awaited me. My village school only went up to 5th, so for further studies, I had to go to the PUPS School in Kaithabedha, around one kilometer away, which happened to be my maternal grandfather\'s village. From 6th to 8th standard, I lived at my nanaji\'s house. Alongside school, I attended tuition classes at Manikeswari Vidyapitha in Adapada. That tuition center became a second home to me — filled with friends, fun, lessons, and sometimes strict discipline.',
            'I continued to participate in every competition. In drawing, I always secured first place; in singing, I was mostly in the top two; and in debates, I often earned a place on the podium. In academics, I maintained a top position in class, and my teachers often made me the class monitor. At times, I even taught my classmates certain topics. We all helped each other during exams — sometimes I would pass on my answers, and sometimes they would help me. Tuition classes were strict; teachers frequently tested us, and a wrong answer meant a sharp rap on the hand with a stick. Though it seemed harsh then, I now realize it instilled discipline and built my study habits.',
        ],
    },
    {
        id: 24,
        type: 'narrative',
        title: 'Stepping into the Sky – My First Flight from Bangalore',
        content: [
            'After my 6th standard, the summer vacation brought an exciting opportunity. My uncle, who was a software engineer in Bangalore, invited my grandparents for a visit. I went along with them, and it turned out to be one of the most thrilling experiences of my life. It was my first time seeing a train up close, and not only that — I traveled in an AC coach! The journey itself felt magical, and when we reached Bangalore, I was left wide-eyed. Tall buildings, wide roads, traffic lights, malls, glittering showrooms — the city lights made even the nights feel like daytime.',
            'I stayed in Bangalore for about one and a half months, exploring new places, trying new foods, and buying new clothes. The most unforgettable moment came during our return journey — we took a flight back. For a village boy like me, this was a historic moment. I was the first child from my village to travel by plane at such a young age. As the aircraft rose into the sky, I thought of my childhood days when I used to watch airplanes flying overhead and wonder what it would be like to be inside one. That day, I was living that dream.',
        ],
    },
    {
        id: 25,
        type: 'narrative',
        title: 'The Hands that Mold, The Mind that Explores',
        content: [
            'In 8th standard, my school organized a science exhibition. I participated with a project on sustainable development — generating electricity from sea waves. Although my project did not get selected for the finals, I had the chance to see 600–700 projects by other students, which sparked a deep interest in science and innovation within me. I also developed a hobby of making Ganesh idols out of clay. Every Ganesh Chaturthi, I would make an idol with my own hands and decorate the classroom blackboard with colorful chalk drawings and messages.',
            'These three years, from 6th to 8th standard, were filled with learning, friendships, competitions, and the warmth of my grandparents and aunt. They shaped my personality and prepared me for the next phase of my journey. By the end of 8th standard, I was ready for new challenges, carrying with me a treasure chest of memories that would stay forever.',
        ],
    },
    {
        id: 26,
        type: 'narrative',
        title: 'Perfume of First Crush',
        content: [
            'After completing my 8th standard at my grandfather\'s village school, a new chapter awaited me. Since that school only offered classes up to the 8th grade, I had to move to another place for my further studies. This time, my destination was my maternal aunt\'s (mausi\'s) house, and I got admitted to the high school in her village.',
            'Once again, the cycle of school, tuitions, and studies began — but this time on a much larger scale. Students from many nearby villages came to study in this school, so the level of competition was much higher. Initially, I was a little nervous, but soon I regained my old rhythm. Just like before, I used to secure the 1st position in class, though sometimes a girl in my class would surpass me and take the top rank.',
        ],
    },
    {
        id: 27,
        type: 'narrative',
        title: '',
        content: [
            'That girl, I must confess, became a very special part of this chapter of my life. The very first day I saw her, my heart skipped a beat. She was not only beautiful but also a perfect example of simplicity, good character, and humility. She was always focused on her studies, respectful to teachers, and polite to everyone. From that day, unknowingly, I started taking extra care of myself — wearing neatly ironed uniforms, applying talcum powder, combing my hair properly, and even carrying pocket perfumes! At home, my aunt and cousins used to tease me, asking why I suddenly started dressing up so much for school. But how could I reveal the true reason behind it? After all, such feelings are treasures one keeps close to the heart.In school, my friends would always pull my leg whenever they noticed me trying to talk to her. They would tease me with sounds like "haan haan, chalne do..." followed by laughter. But deep inside, I knew those were some of the happiest moments of my school life. We often exchanged smiles, and whenever our eyes met, there was always a silent understanding between us. Unfortunately, we were in different tuition classes, so we could never become very close — just friends. I often regret not being able to express my feelings to her, but those innocent days of silent admiration remain among my sweetest memories.',
        ],
    },
    {
        id: 28,
        type: 'narrative',
        title: '',
        content: [
            'One small yet memorable routine was that her tuition was on the opposite side of my aunt\'s house. So every day, she would pass by riding her bicycle. I would intentionally come outside during those times, just to get a glimpse of her. Those little glances made my day.',
            'Meanwhile, studies were always my top priority. Teachers admired my performance and sincerity. I worked hard not only in class but also for competitive exams. During this time, one of the most important milestones was the Pathani Samanta Mathematics Scholarship Test (PMST). All of us friends prepared rigorously, even at tuition, sometimes setting aside school lessons just to practice for this exam.',
            'Finally, the exam day arrived, and I gave it my best. When the results were announced, I was stunned — out of the entire school, I was the only student who cleared the exam! That achievement filled me with immense pride, and I also received a scholarship from the government, with the prize money directly credited to my bank account. It was, in fact, my second scholarship. The first one was when I cleared the Pathani Samanta exam in 9th grade itself, after failing to crack the Navodaya exam back in 5th standard.',
            'This success boosted my confidence and strengthened my belief that hard work never goes to waste.',
            'And thus, my 9th and 10th standard became a beautiful blend of academics, friendship, innocent love, and unforgettable achievements. Truly, it was one of the golden phases of my life.',
        ],
    },
    {
        id: 29,
        type: 'narrative',
        title: 'School\'s Farewell, Future\'s Welcome',
        content: [
            'When my 10th class ended, I was overjoyed. I kept thinking, "Now I\'m no longer a school student—I\'ve become a college student!" My friends and I celebrated together, went on picnics, and traveled to different places, making memories full of fun and laughter.',
            'But soon, the time arrived for the most awaited moment—the announcement of our 10th board exam results.',
            'We were all nervous, whispering to each other, "Brother, what will the result be? I have no idea what\'s going to happen."',
            'As the final 10 minutes approached before the results went live, everyone\'s heartbeat grew faster and faster, sweat rolled down our foreheads, and tension filled the air.',
        ],
    },
    {
        id: 30,
        type: 'narrative',
        title: '',
        content: [
            'Finally, the results were published, and each of us rushed to check our marks on the online portal.',
            'When I saw mine, my heart sank. I felt disappointed because I had believed I could score higher. I went to my tuition sir and explained everything to him, tears welling up in my eyes like an endless ocean.',
            'But sir consoled me, saying, "It\'s fine. Even if you lost 20–30 marks, it\'s still a good score. You should be happy—you got 82.5%."',
            'The truth was, in our batch, there was no real board exam. Because of the ongoing COVID pandemic, schools had mostly remained closed, and our final marks were calculated based on our 9th class performance combined with internal marks from 10th.',
            'And that became one of my deepest regrets—that in my life, I had appeared for every kind of exam, participated in every competition, but for the very first "big" exam of life—the Board exam—I never got the chance to actually sit for it.',
            'My family, though, supported me. They said, "Don\'t worry about it. Focus on your +2 studies. Get good marks there. What\'s done is done—there\'s no point stressing over it."',
            'After three to four days, my mind finally calmed down. I accepted the truth and told myself: "What\'s gone is gone... Now, I must look ahead and focus on what the future holds."',
        ],
    },
    {
        id: 31,
        type: 'narrative',
        title: 'The Turning Point',
        content: [
            '"Life had already written countless chapters on the pages of my journey...',
            'Each one carrying its own laughter, struggles, and unforgettable moments.',
            'The days of school—filled with innocent dreams, playful friendships, and youthful ambitions—',
            'were like the fragrance of fresh flowers, short yet everlasting in memory.',
            'But as one chapter closed with the farewell to school,',
            'a new door slowly opened—the door to Intermediate life,',
            'where the world seemed bigger, challenges sharper, and dreams bolder.',
            'This was not just a step forward in education...',
            'it was the beginning of discovering who I truly was,',
            'as I stepped into the vibrant yet uncertain world of +2 life."',
        ],
    },
    {
        id: 32,
        type: 'narrative',
        title: 'The Threshold of +2 Life',
        content: [
            '"Samay ki ghaadi tez chal rahi thi...',
            'Har din ke saath zimmedariyan badh rahi thi.',
            'Ab main sirf ek gaon ka ladka nahi raha tha,',
            'balki apne ghar ka sabse bada putra –',
            'jiske kandhon par poore parivaar ki ummeedein tikki thi.',
            '10th standard ki kahani to khatam ho chuka tha...',
            'aur ab ek naya adhyay Meri Intermediate School Life me',
            'pehela kadam bhi pad chu ka tha."',
        ],
    },
    {
        id: 33,
        type: 'narrative',
        title: 'The Call That Changed My Path',
        content: [
            'Just after my 10th exams ended, one day I received a phone call. At that time, even the sound of the telephone ringing was exciting for me — and this time, it was about college admission.',
            'I tried to speak in a mix of Hindi and English, as if I had suddenly stepped into the world of grown-ups. It felt like I was standing at the doorway of a brand-new life.',
            'While talking, I had no idea that the person on the other side was the lady warden of the college. She very kindly explained all the details — how the admission process worked, which documents were required, how the hostel system functioned, and by what date I had to report.',
            'In that moment, I was both nervous and happy. It was the very first time I was speaking directly with someone from outside my village — an authority figure. The feeling was unforgettable.',
        ],
    },
    {
        id: 34,
        type: 'narrative',
        title: 'The First Step Beyond Home',
        content: [
            'After the call, I discussed everything with my family members — that I wanted to take admission in this college. It was going to be my first private college, since until 10th I had studied only in government schools.',
            '',
            'The preparations before admission were also memorable. Buying notes, books, pens, pencils, a water bottle, blanket, jug, bucket — every single item I bought filled me with a new kind of joy.',
            'I felt as if I was about to start a whole new world in the hostel, stepping into this journey as the hero of my own story.',
        ],
    },
    {
        id: 35,
        type: 'narrative',
        title: 'From Village Lanes to Hostel Walls',
        content: [
            '"College ke gate par kadam rakhte hi,',
            'Mann me ek purani khidki khul gayi thi.',
            'Yaad aaya woh gaon ka ghar,',
            'Jahan khwabon ko pehli baar pankh mile the.',
            'Khuli hawaon me kheton ki khushboo,',
            'Mitti ki mehak, maa ke haathon ka khana.',
            'Wo doston ke saath galiyon me hasna,',
            'Aur shaam ko chaand ke neeche baith kar sapne bunna.',
            'Ab hostel ke chhote kamre me bistar sajana hai,',
            'Par dil abhi bhi un purane palon ko dhoondhta hai.',
            'Ek taraf naya safar, ek taraf bachpan ki gali,',
            'Dono ke beech khada, ek naye main ki kahani likh rahi."',
        ],
    },
    {
        id: 36,
        type: 'narrative',
        title: 'The Day My Future Got Its First Signature',
        content: [
            'And then, the day finally arrived — admission day.',
            'My grandfather and I traveled together from our village to Berhampur town, about 30 kilometers away. The name of the college was Nalanda Vidya Mandir (NVM).',
            'The moment I saw the college campus, my heartbeat quickened. This was the place where my life was going to change forever.',
            'At the admission counter, my grandfather spoke with the staff. The discussion went on about the fees, and he shared the story of our poor family background — but also proudly mentioned that I had always stood first in my studies.',
            'That negotiation scene is still fresh in my memory, as if my grandfather had put his entire heart and soul on the line for me.',
            'And then... my admission was confirmed.',
            'That day, both my grandfather and I had a unique glow on our faces. While returning home, one thought kept echoing in my heart — my life was truly about to change.',
        ],
    },
    {
        id: 37,
        type: 'narrative',
        title: 'When Hostel Became My Second Home',
        content: [
            'The admission was done, and now the only wait was—when I would go to the hostel and when the classes would begin. Days kept passing... 10 to 15 days had already gone by, and my patience was beginning to break.',
            'Then one day—the awaited message arrived: "Classes will begin from Monday."',
            'At that very moment, my happiness knew no bounds. On Sunday, I packed all my things—luggage, bags, and small hostel essentials. With dreams of a new world in my heart, I prepared to step into hostel life.',
            'That day, I wasn\'t alone. My mother and grandfather went with me to drop me at the hostel. Together we went, and finally, my hostel and room were allotted.',
            'And then... for the first time, I stepped inside the hostel.',
            'The very first step of a new journey—marking the beginning of a whole different world.',
        ],
    },
    {
        id: 38,
        type: 'narrative',
        title: 'The Mystery of the Empty Bed',
        content: [
            'When I entered my +2 college, one of my high school friends, Pabitra, also joined the same college. Both of us got admitted to the same hostel and were even allotted the same room.',
            'But when we went there, we found that another boy had already been assigned to that room before us. His name was Santosh. So now, we were three people in a single room. Still, one bed was empty. We kept waiting curiously, wondering who would come to occupy that last bed.',
            'The room was very small and compact—it had an attached bathroom, but the beds were placed so close to each other that there was almost no space left. We had to do everything on our beds itself. Between the washroom and the beds, there was barely a one-meter gap.',
            'Each of us was given a small shelf for keeping our books and belongings. We all arranged our things neatly in our places and then kept waiting for the arrival of the fourth roommate, who would complete our little hostel family.',
        ],
    },
    {
        id: 39,
        type: 'narrative',
        title: '',
        content: [
            'Finally, the boy we had all been waiting for arrived.',
            'The three of us — Pabitra, Santosh, and I — were from nearby villages, just 2 to 3 kilometers apart.',
            'Naturally, we kept wondering who the fourth roommate would be. Deep inside, we hoped that whoever came would be a good student.',
            'And then he came... His name was Krishna.',
            'When I saw him for the first time, I thought, "Who is this boy entering my room?"',
            'His hairstyle, his dress code — everything looked completely different from what I had imagined.',
            'Honestly, I was disappointed at first. I had expected a disciplined, studious boy to join us, but he didn\'t seem like that at all.',
            'But life has its own way of teaching lessons. People say, "Appearances can be deceiving" — and that\'s exactly what happened to me. Though I doubted him at first, with time I realized I was completely wrong.',
            'His nature, his heart, and his character were just like Lord Krishna himself. Pure, kind, and full of goodness. Truly, it was by God\'s grace that such a wonderful boy became my roommate.',
            'That night turned out to be our first night in the hostel. We all sat together, talked for hours, and slowly began to understand each other. A bond started forming.',
            'The next morning, our classes began. Every day we had to walk to college. Among the four of us, Krishna, Pabitra, and I were placed in the same section, while Santosh was in another.',
            'Day by day, we adjusted to hostel life. Soon, we also made friends with students from other rooms. And before we knew it, the entire hostel became like one big family, where every student shared laughter, stories, and memories.',
        ],
    },
    {
        id: 40,
        type: 'narrative',
        title: 'The Invisible Device',
        content: [
            'Like every hostel, ours too had some strict rules and regulations.',
            'No mobiles allowed.',
            'No induction stoves, no water heaters — restrictions everywhere.',
            'But we thought, "At least one mobile we must keep in the room, otherwise how will we talk to our family?"',
            'Because to call home, we had to go to the warden\'s office, where a long line of students would already be waiting, each desperate to talk to their parents. The whole process was a headache.',
            'One holiday, when college was closed for a festival, I went back to my village. While returning, I thought, "Why not take my mobile along this time?"',
            'But there was a big problem — where to hide it?',
            'If the warden found it, the mobile would be seized immediately.',
            'Then an idea struck me.',
            'I took a thick notebook, about 3 cm in width, and carefully cut out the exact shape of my mobile in the middle pages.',
            'When I placed my phone inside and closed the notebook, it looked like a completely ordinary copy.',
            'Perfect camouflage',
        ],
    },
    {
        id: 41,
        type: 'narrative',
        title: 'Walking Through Darkness Towards Knowledge',
        content: [
            'But whenever exams were near, I used to leave my phone at home and go to the hostel, because at that time, studying was my only focus.',
            'I don\'t think any other college was as strict as our Nalanda Vidya Mandir (NVM) when it came to studies. We had exams every single month, and the strictness was beyond imagination.',
            'Every exam morning, we had to wake up at 4:00 a.m. The atmosphere was unforgettable—some rushed to the toilet, some went for a bath, some just brushed their teeth, and a few didn\'t do anything at all, straight away leaving for the exam.',
            'Outside, there was only darkness all around, with a chilling cold breeze that made the journey even harder. But whenever people saw us walking toward the college at such an early hour, they always said, "These kids are truly hardworking."',
        ],
    },
    {
        id: 42,
        type: 'narrative',
        title: '',
        content: [
            'This became our routine—waking up at 4:00 a.m., walking to the college in the dark, writing exams from 5:00 to 6:30 a.m., and then returning to the hostel. After getting fresh, we had to attend college again for regular classes and study the whole day.',
            'In our college, play was almost a forbidden word. We never had a playground. There was only one rule: study, study, and study. The only relief we had was buying something from small shops on the way to college. And even outings were allowed only on Sundays.',
        ],
    },
    {
        id: 43,
        type: 'narrative',
        title: 'The Girls Who Turned Moments into Memories',
        content: [
            '"NVM ke campus me ek ajeeb sa kanoon tha,',
            'Ladkiyon se baat karna toh door ki baat,',
            'Unhe dekhna bhi mana tha.',
            'Par dil ka kya karein?',
            'Aankhen to apna kaam karti thi,',
            'Darwaze ki halki si darar se,',
            'Sapnon ka jharokha khul jaata tha.',
            'Breakfast aur lunch ke raste,',
            'Unke kadmon ki aahat sunai deti thi.',
            'Bas kuch pal ke liye dekhna,',
            'Aur phir din bhar usi yaad pe jeena.',
            '',
            'Warden ki dastak darwaza bandh kar jaati,',
            'Par jawani ke jugad bhi kam nahi hote.',
            'Kabhi pendrive se gaane,',
            'Kabhi smart board par nazare.',
            'Aur jab Sunday ko kismat saath deti,',
            'Tab wo pal aata jaisa do trains cross hoti.',
            'Wo kuch seconds ka nazara,',
            'Maano saari duniya ruk jaati.',
            'NVM ke sakht niyam ke peeche,',
            'Ek chhupi hui mohabbat ki duniya thi,',
            'Jahan ek jhalak hi kafi thi,',
            'Dil ko saal bhar ke liye roshan karne ke liye."',
        ],
    },
    {
        id: 44,
        type: 'narrative',
        title: 'No Talking, Just Looking & Rare Crossing',
        content: [
            'My NVM college was so strict that talking to girls was out of the question.',
            'In fact, forget talking — we were not even allowed to look at them.',
            'If someone wanted to talk to a girl, he had to first take permission from the warden. Imagine that!',
            'But of course, we boys had our own secret tricks.',
            'We couldn\'t talk, but at least we could see them. So, whenever girls went for breakfast or lunch, we purposely kept our classroom door slightly open — just to catch a glimpse.',
            'That small glance was enough to make us happy because in our college, talking to girls was nothing less than a dream.',
            'Sometimes the warden would come and shut the door, spoiling even that little happiness. No talking, no looking — total ban!',
        ],
    },
    {
        id: 45,
        type: 'narrative',
        title: '',
        content: [
            'But we found another "jugaad."',
            'Sometimes we would plug a pendrive into the smartboard and play video songs, pretending to watch the screen, but actually waiting for the girls to pass by their classroom on the way to lunch.',
            'They were served food before us, so by the time we got to eat, our eyes had already feasted.',
            'Once, we even asked our warden:',
            '"Ma\'am, at home, usually men eat first and then the women. So why in the hostel do you serve the girls first?"',
            'She laughed and replied, "You boys can control your hunger for some time, but girls can\'t. That\'s why they get food first."',
            'And oh, Sundays were extra special.',
            'Because sometimes, just by luck, the timings matched — when girls finished lunch and were returning to their hostel, at the very same moment we were heading to the mess.',
            'That moment felt like two trains crossing each other — short, fleeting, but magical.',
            'A rare chance given only by God\'s blessings, to see them closely.',
        ],
    },
    {
        id: 46,
        type: 'narrative',
        title: 'The Unexpected Reward',
        content: [
            'Everything was going on as usual — strict rules, secret glances, and of course, studies side by side.',
            'That\'s how our 1st year ended. After one month\'s break, our next journey began. We all entered 2nd year.',
            'This time our hostel changed. Now instead of 4, there were 6 people in one room. Two new roommates joined us — their names were Deepak and Roshan.',
            'The routine remained the same: daily exams, writing assignments, completing homework.',
            'Time passed, and slowly the board exams started coming closer. Everyone was busy with preparation.',
            'Half the year passed, and now only 5 months were left for final exams.',
            'But then... came a twist in the story.',
            'Remember I told you earlier that in NVM, looking at girls was a dream for us?',
            'Well, something happened that we had never imagined even in our dreams.',
            'The rule was: students who scored above 80% would be placed in a special section. In that section, boys and girls sat together.',
        ],
    },
    {
        id: 47,
        type: 'narrative',
        title: '',
        content: [
            'And yes — I was one of those students above 80%!',
            'The rest, those who scored below 80%, still had to follow the same old rules — no mixing.',
            'When we went to the hostel, the warden announced:',
            '"From tomorrow onwards, you all will sit with girls in the same class."',
            'We were over the moon! That night we couldn\'t sleep at all. We shouted, celebrated, and laughed like crazy. All we wanted was for morning to come soon, so we could finally attend class with them.',
            'Next day, everyone dressed in new uniforms, applied extra perfume, powder, and went fully prepared, looking their absolute best.',
            'And then... the moment arrived.',
            'The entry of those fairies we had been waiting to see closely for the last 1 year and 6 months.',
        ],
    },
    {
        id: 48,
        type: 'narrative',
        title: 'A Birthday Boy Without a Birthday',
        content: [
            'That very day, my first conversation in NVM happened.',
            'I always sat at the first bench, first place. That day, the girl sitting beside me — her name was Suhani — asked me for my notes. That was the very first time I spoke to a girl in college.',
            'I gave her my notebook, and immediately the whole class started looking at me. The boys, of course, couldn\'t resist making noises — "Aaaaannnnn... hau hau... aaaaa..."',
            'That\'s how it all started — slowly, conversations began between boys and girls, and once it started, it never really stopped.',
            'Everyone called me "Ritesh Bhai" and I actually enjoyed talking with them.',
            'One day, I was sitting in class, sketching. I tried drawing the side profile of a girl\'s face. By the time I finished, it felt like a miracle — the drawing looked exactly like a real girl in our class. Her face and my sketch matched 100%.',
            'Then, one day, it was that same girl\'s birthday. She distributed chocolates in class. But here\'s the twist — she gave chocolates with her own hands only to the girls.',
            'When it came to the boys, she turned to me and said:',
        ],
    },
    {
        id: 49,
        type: 'narrative',
        title: '',
        content: [
            '"Ritesh Bhai, please distribute the chocolates to all the boys. Whatever is left, you can keep for yourself."',
            'So I went around giving chocolates to everyone. But instead of saying thank you, all the boys started teasing me:',
            '"Happy Birthday, Ritesh!"',
            'The whole class laughed, and it turned into a fun moment.',
            'But the real comedy came just 4 days later.',
            'It was another girl\'s birthday. Again, she gave chocolates to all the girls by hand... and again, she asked me:',
            '"Ritesh Bhai, please distribute to the boys. Whatever remains, you keep."',
            'So once again, I distributed chocolates to the boys. And again, the boys shouted:',
            '"Happy Birthday, Ritesh!"',
            'And then one of them joked:',
            '"Arre Ritesh bhai, how come you\'re taking birth twice in the same year?"',
            'The whole class burst into laughter. Those moments were priceless.',
        ],
    },
    {
        id: 50,
        type: 'narrative',
        title: 'From Shading Bones to Blasting Test Tubes',
        content: [
            'So, while all this was going on, soon the practical exams for the board began.',
            'Every subject had its own practicals, but in Zoology there were lots of drawings — bones, hearts, fishes, snakes, birds, frogs, etc. I drew all of them very beautifully, adding shading and making them look amazing.',
            'Some students, after seeing my drawings, even requested me to draw for them. And of course, I did!',
            'But when it came to the Chemistry practical, oh boy — it was a near disaster!',
            'There was that laboratory burner, and by mistake, I left it open. Suddenly, a huge flame shot up high into the air. Everyone panicked for a moment, but thankfully, one student quickly turned off the gas regulator, and only then the fire went out.',
            'That day, I also ended up destroying many test tubes — but honestly, I kind of enjoyed it!',
            'Here\'s what I did: I would heat the test tube on the burner until it was red hot, then suddenly dip it in cold water. CRACK! It would break from the bottom with a sound just like a small bomb blast. It felt thrilling — like playing with mini firecrackers right inside the lab.',
            'So yes... those mischievous little "lab accidents" made the practical sessions unforgettable and, in a way, super fun.',
        ],
    },
    {
        id: 51,
        type: 'narrative',
        title: 'The Day My +2 Journey Ended in Tears & Signatures',
        content: [
            'A few days later, our final board exams finally arrived.',
            'All of us had prepared well. The first paper was Mathematics.',
            'When I sat in the exam hall and looked at the question paper, I thought to myself:',
            '"Today, I\'m going to smash this paper — it\'s so easy!"',
            'But as always, what happens to me every time, happened again that day too.',
            'In excitement, I made a silly mistake on a long question.',
            'All I had to do was divide by 2, and I even wrote it down, but I forgot to actually divide! Because of that small error, I lost marks unnecessarily.',
            'Still, overall, I felt like the exams went well.',
            'But then came my weakest subject — English. That\'s where I lost the most marks. Out of 100, I only scored 60.',
            'In every other subject, I scored above 85, and in Physics and Biology, I even got above 95.',
            'But because of that one subject, my dream of scoring higher than 10th grade was crushed.',
            'I ended up again with just around 80%. My heart sank... all thanks to English.',
        ],
    },
    {
        id: 52,
        type: 'narrative',
        title: 'Goodbye Hostel',
        content: [
            'Finally, the exams ended.',
            'On the last day, everyone returned to college in their uniforms, signing each other\'s shirts and pens as memories. We even took signatures from our teachers.',
            'That\'s how my +2 journey came to an end.',
            'And on that very day, all the students left the hostel and went back to their homes.',
            'That moment was filled with both happiness and tears.',
            'Everyone was emotional. I was deeply sad, and so were all my friends. It truly felt like the closing of a beautiful, unforgettable chapter of life.',
        ],
    },
    {
        id: 53,
        type: 'quote',
        title: 'Conclusion',
        quote: [
            '"As I look back at my journey, I feel both joy and sorrow. Joy — because every person who raised me gave me love, guidance, and strength. Sorrow — because I could not always stay with my own parents. Yet, every experience has shaped me into who I am today. I carry my mother\'s love, my grandparents\' wisdom, my aunt\'s care, and my teachers\' discipline in my heart forever. With their blessings, I am ready to move ahead and create a life full of purpose, passion, and gratitude."',
        ],
    },
    {
        id: 54,
        type: 'cover',
        title: 'Thank You',
        subtitle: 'for reading my story',
    },
];

// PDF Download function
const generateAutobiographyPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = margin;

    const addNewPageIfNeeded = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
        }
    };

    AUTOBIOGRAPHY_SECTIONS.forEach((section, index) => {
        // Add title if exists
        if (section.title) {
            addNewPageIfNeeded(20);
            doc.setFontSize(section.type === 'cover' ? 28 : 18);
            doc.setFont('helvetica', 'bold');
            const titleLines = doc.splitTextToSize(section.title, maxWidth);
            doc.text(titleLines, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += titleLines.length * (section.type === 'cover' ? 12 : 8) + 10;
        }

        // Add subtitle for cover pages
        if (section.subtitle) {
            addNewPageIfNeeded(15);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'italic');
            doc.text(section.subtitle, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;
        }

        // Add quote content
        if (section.quote) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'italic');
            section.quote.forEach((line) => {
                const lines = doc.splitTextToSize(line, maxWidth);
                addNewPageIfNeeded(lines.length * 7);
                doc.text(lines, pageWidth / 2, yPosition, { align: 'center' });
                yPosition += lines.length * 7 + 5;
            });
        }

        // Add content
        if (section.content) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            section.content.forEach((paragraph) => {
                if (paragraph === '') {
                    yPosition += 5;
                    return;
                }
                const lines = doc.splitTextToSize(paragraph, maxWidth);
                addNewPageIfNeeded(lines.length * 6);
                doc.text(lines, margin, yPosition);
                yPosition += lines.length * 6 + 4;
            });
        }

        // Add page separator
        if (index < AUTOBIOGRAPHY_SECTIONS.length - 1) {
            yPosition += 15;
            if (yPosition > pageHeight - 50) {
                doc.addPage();
                yPosition = margin;
            }
        }
    });

    // Save the PDF
    doc.save('Ritesh_Autobiography.pdf');
};

// Individual section component with scroll-triggered animation
const AutobiographySection: React.FC<{ section: PageSection; index: number }> = ({ section, index }) => {
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Cover page layout
    if (section.type === 'cover') {
        return (
            <section
                ref={sectionRef}
                className={`
          relative min-h-screen w-full flex items-center justify-center
          bg-gradient-to-br from-parchment-200 via-parchment-300 to-parchment-400
          dark:from-antique-100 dark:via-antique-50 dark:to-antique-100
          transition-all duration-1000 ease-out
          ${visible ? 'opacity-100' : 'opacity-0'}
        `}
            >
                {/* Background texture */}
                <div className="absolute inset-0 opacity-30 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay pointer-events-none"></div>

                {/* Decorative map background */}
                <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cpath d='M0 0h400v400H0z' fill='none'/%3E%3Cpath d='M50 50c100 50 200-50 300 0M50 150c100 50 200-50 300 0M50 250c100 50 200-50 300 0M50 350c100 50 200-50 300 0' stroke='%238B7355' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3C/svg%3E")`,
                        backgroundSize: '400px 400px',
                    }}
                ></div>

                {/* Download PDF Button - Top Right Corner */}
                <button
                    onClick={generateAutobiographyPDF}
                    className="absolute top-40 right-6 md:right-10 z-20 flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5
                               bg-gradient-to-br from-amber-600 to-amber-800 
                               dark:from-amber-700 dark:to-amber-900
                               text-amber-50 font-serif text-xs md:text-sm
                               rounded-lg shadow-lg hover:shadow-xl 
                               transform hover:scale-105 transition-all duration-300
                               border border-amber-500/30"
                    title="Download Autobiography as PDF"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 md:w-5 md:h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                </button>

                {/* Main content area - Title displayed directly on parchment */}
                <div
                    className={`
            relative z-10 text-center px-8 max-w-4xl
            transform transition-all duration-1000 delay-300
            ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `}
                >
                    <h1 className="font-script text-6xl md:text-8xl lg:text-9xl text-parchment-900 dark:text-antique-900 leading-tight">
                        {section.title}
                    </h1>
                    <p className="mt-8 font-serif text-2xl md:text-3xl text-parchment-800 dark:text-antique-800 tracking-wide">
                        {section.subtitle}
                    </p>
                </div>

                {/* Decorative leaves - top left */}
                <div className="absolute top-16 left-4 md:left-8 w-20 h-28 opacity-50 dark:opacity-40">
                    <div className="w-12 h-20 bg-gradient-to-br from-green-800 to-green-900 rounded-full transform -rotate-45"></div>
                </div>

                {/* Decorative leaves - bottom right */}
                <div className="absolute bottom-24 right-8 md:right-16 w-16 h-24 opacity-50 dark:opacity-40">
                    <div className="w-10 h-18 bg-gradient-to-br from-green-800 to-green-900 rounded-full transform rotate-30"></div>
                </div>

                {/* Decorative flower element - bottom left */}
                <div className="absolute bottom-20 left-1/4 opacity-40">
                    <div className="w-16 h-16 rounded-full bg-gradient-radial from-white/60 to-transparent"></div>
                </div>

                {/* Page indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-serif text-sm">
                    {section.id}
                </div>
            </section>
        );
    }

    // Quote page layout
    if (section.type === 'quote') {
        return (
            <section
                ref={sectionRef}
                className={`
          relative min-h-screen w-full flex items-center justify-center
          bg-gradient-to-br from-parchment-200 via-parchment-300 to-parchment-400
          dark:from-antique-100 dark:via-antique-50 dark:to-antique-100
          transition-all duration-1000 ease-out
          ${visible ? 'opacity-100' : 'opacity-0'}
        `}
            >
                {/* Background texture */}
                <div className="absolute inset-0 opacity-30 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay pointer-events-none"></div>

                {/* Decorative leaves */}
                <div className="absolute top-20 left-8 w-16 h-24 bg-gradient-to-br from-green-800 to-green-900 opacity-60 dark:opacity-40 rounded-full transform -rotate-45"></div>
                <div className="absolute bottom-32 right-12 w-12 h-20 bg-gradient-to-br from-green-800 to-green-900 opacity-60 dark:opacity-40 rounded-full transform rotate-45"></div>
                <div className="absolute bottom-20 right-32 w-10 h-16 bg-gradient-to-br from-green-700 to-green-800 opacity-50 dark:opacity-30 rounded-full transform rotate-12"></div>

                {/* Content displayed directly on parchment - no box */}
                <div
                    className={`
            relative max-w-4xl mx-8 px-4 md:px-8
            transform transition-all duration-1000 delay-300
            ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `}
                >
                    {/* Title */}
                    <h2 className="relative font-script text-4xl md:text-5xl lg:text-6xl text-parchment-900 dark:text-antique-900 mb-12 text-center">
                        {section.title}
                    </h2>

                    {/* Quote content */}
                    <div className="relative space-y-4 text-center">
                        {section.quote?.map((line, i) => (
                            <p
                                key={i}
                                className={`
                  font-serif text-lg md:text-xl lg:text-2xl leading-relaxed
                  ${i === 1 ? 'font-semibold text-parchment-900 dark:text-antique-900' : 'italic text-parchment-800 dark:text-antique-800'}
                `}
                            >
                                {line}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Page indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-serif text-sm">
                    {section.id}
                </div>
            </section>
        );
    }

    // Introduction page with image
    if (section.type === 'introduction') {
        return (
            <section
                ref={sectionRef}
                className={`
          relative min-h-screen w-full flex items-center justify-center
          bg-gradient-to-br from-parchment-200 via-parchment-300 to-parchment-400
          dark:from-antique-100 dark:via-antique-50 dark:to-antique-100
          transition-all duration-1000 ease-out
          ${visible ? 'opacity-100' : 'opacity-0'}
        `}
            >
                {/* Background texture */}
                <div className="absolute inset-0 opacity-30 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay pointer-events-none"></div>

                {/* Decorative elements */}
                <div className="absolute top-16 left-4 w-20 h-20 opacity-40">
                    <div className="w-full h-full rounded-full bg-gradient-radial from-white/60 to-transparent"></div>
                </div>
                <div className="absolute bottom-24 right-8 w-14 h-22 bg-gradient-to-br from-green-800 to-green-900 opacity-50 dark:opacity-30 rounded-full transform rotate-30"></div>

                {/* Main content area */}
                <div className={`relative z-10 max-w-6xl mx-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${section.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Photo frame - simple border style */}
                    <div
                        className={`
              relative flex-shrink-0 transform transition-all duration-1000 delay-300
              ${visible ? 'translate-x-0 opacity-100' : section.imagePosition === 'right' ? 'translate-x-16 opacity-0' : '-translate-x-16 opacity-0'}
            `}
                    >
                        <div className="relative border-4 border-parchment-500/60 dark:border-antique-300/60 bg-parchment-100 dark:bg-antique-50">
                            <div className="w-40 h-52 md:w-48 md:h-64 flex items-center justify-center">
                                <span className="font-serif text-sm text-parchment-500 dark:text-antique-500 text-center px-4 italic">
                                    {section.imagePlaceholder}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Text content */}
                    <div
                        className={`
              relative flex-1 transform transition-all duration-1000 delay-500
              ${visible ? 'translate-x-0 opacity-100' : section.imagePosition === 'right' ? '-translate-x-16 opacity-0' : 'translate-x-16 opacity-0'}
            `}
                    >
                        {/* Title */}
                        <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-parchment-900 dark:text-antique-900 mb-8">
                            {section.title}
                        </h2>

                        {/* Content */}
                        <div className="space-y-3">
                            {section.content?.map((line, i) => (
                                <p
                                    key={i}
                                    className={`
                    font-serif text-base md:text-lg leading-relaxed text-parchment-800 dark:text-antique-800
                    ${line.startsWith('"') || line.endsWith('"') ? 'italic' : ''}
                    ${line.startsWith('Main sirf') ? 'font-medium' : ''}
                  `}
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Page indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-serif text-sm">
                    {section.id}
                </div>
            </section>
        );
    }

    // Narrative page layout (default)
    return (
        <section
            ref={sectionRef}
            className={`
        relative min-h-screen w-full flex items-center justify-center
        bg-gradient-to-br from-parchment-200 via-parchment-300 to-parchment-400
        dark:from-antique-100 dark:via-antique-50 dark:to-antique-100
        transition-all duration-1000 ease-out
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
        >
            {/* Background texture */}
            <div className="absolute inset-0 opacity-30 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay pointer-events-none"></div>

            {/* Decorative leaves */}
            <div className="absolute top-16 left-4 w-20 h-20 opacity-30">
                <div className="w-full h-full rounded-full bg-gradient-radial from-white/60 to-transparent"></div>
            </div>
            <div className="absolute bottom-24 right-8 w-12 h-20 bg-gradient-to-br from-green-800 to-green-900 opacity-50 dark:opacity-30 rounded-full transform rotate-45"></div>
            <div className="absolute bottom-40 left-12 w-10 h-16 bg-gradient-to-br from-green-700 to-green-800 opacity-40 dark:opacity-20 rounded-full transform -rotate-30"></div>

            {/* Content displayed directly on parchment - no box */}
            <div
                className={`
          relative max-w-4xl mx-8 px-4 md:px-8
          transform transition-all duration-1000 delay-300
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}
            >
                {/* Title */}
                {section.title && (
                    <h2 className="relative font-script text-3xl md:text-4xl lg:text-5xl text-parchment-900 dark:text-antique-900 mb-10 text-center">
                        {section.title}
                    </h2>
                )}

                {/* Content paragraphs */}
                <div className="relative space-y-4">
                    {section.content?.map((paragraph, i) => {
                        if (paragraph === '') {
                            return <div key={i} className="h-4"></div>;
                        }

                        // Check for emphasized text patterns
                        const isQuote = paragraph.startsWith('"') && paragraph.endsWith('"');
                        const isEmphasis = paragraph.includes('To me, life is not just') ||
                            paragraph.includes('King, Queen, Minister');
                        const isCentered = paragraph.includes('King, Queen, Minister') ||
                            paragraph.includes('She had a secret');

                        return (
                            <p
                                key={i}
                                className={`
                  font-serif leading-relaxed text-parchment-800 dark:text-antique-800
                  ${isQuote ? 'italic text-base md:text-lg' : 'text-base md:text-lg'}
                  ${isEmphasis ? 'text-lg md:text-xl font-medium text-parchment-900 dark:text-antique-900' : ''}
                  ${isCentered ? 'text-center' : ''}
                `}
                            >
                                {paragraph}
                            </p>
                        );
                    })}
                </div>
            </div>

            {/* Page indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-serif text-sm">
                {section.id}
            </div>
        </section>
    );
};

export const AutobiographyPage: React.FC = () => {
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        // Initial page load animation
        const timer = setTimeout(() => setPageLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`
        min-h-screen bg-parchment-200 dark:bg-antique-50 
        transition-opacity duration-1000
        ${pageLoaded ? 'opacity-100' : 'opacity-0'}
      `}
        >
            <ScrollNavbar />

            {/* Autobiography sections */}
            <main>
                {AUTOBIOGRAPHY_SECTIONS.map((section, index) => (
                    <AutobiographySection key={section.id} section={section} index={index} />
                ))}
            </main>

            {/* End of autobiography indicator */}
            <div className="py-20 text-center bg-parchment-300 dark:bg-antique-100">
                <p className="font-serif text-lg italic">
                    — To be continued... —
                </p>
                <p className="font-serif text-sm mt-2">
                    Pages 1-54 of the autobiography
                </p>

                {/* Scroll to top button */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="mt-8 mx-auto flex items-center justify-center w-14 h-14 rounded-full 
                               bg-gradient-to-br from-amber-600 to-amber-800 
                               dark:from-amber-700 dark:to-amber-900
                               shadow-lg hover:shadow-xl transform hover:scale-110 
                               transition-all duration-300 cursor-pointer
                               border-2 border-amber-500/50"
                    title="Scroll to top"
                    aria-label="Scroll to top"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-amber-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
                <p className="font-serif text-xs mt-3">Back to Top</p>
            </div>
        </div>
    );
};
