/* data/data.js */
(function(){
  const inPages = location.pathname.includes("/pages/");
  const P = inPages ? "../" : "";

  const pad = (n) => String(n).padStart(2, "0");

  window.AETHERIA_DATA = {
    cities: Array.from({ length: 12 }, (_, i) => {
      const n = pad(i + 1);
      return {
        id: `city-${n}`,
        title: `City ${n}`,
        subtitle: "Calm streets • Strong identity",
        image: `${P}images/cities/city-${n}.jpg`,
        facts: ["Modern + classic vibe", "Good for photography", "Clean and organized"]
      };
    }),

    islands: Array.from({ length: 8 }, (_, i) => {
      const n = pad(i + 1);
      return {
        id: `island-${n}`,
        title: `Island ${n}`,
        subtitle: "Waves • Nature • Calm",
        image: `${P}images/islands/island-${n}.jpg`,
        facts: ["Clear shores", "Peaceful sunsets", "Great for exploration"]
      };
    }),

    universities: [
      {
        id:"uni-oxford",
        name:"University of Oxford",
        country:"United Kingdom",
        image:`${P}images/university/uni-oxford.jpg`,
        highlights:["Research excellence","Historic campus","Global reputation"]
      },
      {
        id:"uni-cambridge",
        name:"University of Cambridge",
        country:"United Kingdom",
        image:`${P}images/university/uni-cambridge.jpg`,
        highlights:["Strong STEM","Prestigious colleges","Innovation culture"]
      },
      {
        id:"uni-kyoto",
        name:"Kyoto University",
        country:"Japan",
        image:`${P}images/university/uni-kyoto.jpg`,
        highlights:["Top research","Beautiful city","Academic tradition"]
      },
      {
        id:"uni-bologna",
        name:"University of Bologna",
        country:"Italy",
        image:`${P}images/university/uni-bologna.jpg`,
        highlights:["Oldest university","European heritage","Lively student life"]
      }
    ]
  };
})();
