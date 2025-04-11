#!/bin/bash

# Create directory for the audio tour files
mkdir -p iceland_audio_tour

# Create the main JSON file with updated section structure
cat > iceland_audio_tour/audio_tour.json << 'EOF'
{
  "title": "Iceland's Southern Shores: A Natural and Cultural Journey",
  "sections": [
    {
      "id": "section0",
      "title": "Introduction: Welcome to Day 3",
      "ssmlFile": "section0_introduction.xml",
      "combineIntoSingleMP3": false
    },
    {
      "id": "section1",
      "title": "Leaving Selfoss",
      "parts": [
        {
          "title": "The Tectonic Divide",
          "ssmlFile": "section1a_leaving_selfoss_part1.xml"
        },
        {
          "title": "Historical Context",
          "ssmlFile": "section1b_leaving_selfoss_part2.xml"
        }
      ],
      "combineIntoSingleMP3": true
    },
    {
      "id": "section2",
      "title": "Seljalandsfoss",
      "parts": [
        {
          "title": "Nature's Veil",
          "ssmlFile": "section2a_seljalandsfoss_part1.xml"
        },
        {
          "title": "Cultural Significance",
          "ssmlFile": "section2b_seljalandsfoss_part2.xml"
        }
      ],
      "combineIntoSingleMP3": true
    },
    {
      "id": "section3",
      "title": "The Journey to Skógafoss",
      "parts": [
        {
          "title": "River Systems",
          "ssmlFile": "section3a_journey_to_skogafoss_part1.xml"
        },
        {
          "title": "Landscape Formation",
          "ssmlFile": "section3b_journey_to_skogafoss_part2.xml"
        }
      ],
      "combineIntoSingleMP3": true
    },
    {
      "id": "section4",
      "title": "Skógafoss",
      "parts": [
        {
          "title": "The Magnificent Falls",
          "ssmlFile": "section4a_skogafoss_part1.xml"
        },
        {
          "title": "Legends and History",
          "ssmlFile": "section4b_skogafoss_part2.xml"
        }
      ],
      "combineIntoSingleMP3": true
    },
    {
      "id": "section5",
      "title": "The Black Desert Road",
      "parts": [
        {
          "title": "Volcanic Landscape",
          "ssmlFile": "section5a_black_desert_road_part1.xml"
        },
        {
          "title": "Katla's Influence",
          "ssmlFile": "section5b_black_desert_road_part2.xml"
        }
      ],
      "combineIntoSingleMP3": true
    },
    {
      "id": "section6",
      "title": "Vikurfjara",
      "parts": [
        {
          "title": "The Black Shore",
          "ssmlFile": "section6a_vikurfjara_part1.xml"
        },
        {
          "title": "Maritime History",
          "ssmlFile": "section6b_vikurfjara_part2.xml"
        }
      ],
      "combineIntoSingleMP3": true
    },
    {
      "id": "section7",
      "title": "Reynisfjara",
      "parts": [
        {
          "title": "The Basalt Columns",
          "ssmlFile": "section7a_reynisfjara_part1.xml"
        },
        {
          "title": "Cultural Heritage",
          "ssmlFile": "section7b_reynisfjara_part2.xml"
        }
      ],
      "combineIntoSingleMP3": true
    },
    {
      "id": "section8",
      "title": "The Final Stretch to Dyrhólaey",
      "ssmlFile": "section8_final_stretch_to_dyrholaey.xml",
      "combineIntoSingleMP3": false
    },
    {
      "id": "section9",
      "title": "Dyrhólaey",
      "parts": [
        {
          "title": "The Natural Arch",
          "ssmlFile": "section9a_dyrholaey_part1.xml"
        },
        {
          "title": "The Bird Sanctuary",
          "ssmlFile": "section9b_dyrholaey_part2.xml"
        }
      ],
      "combineIntoSingleMP3": true
    },
    {
      "id": "section10",
      "title": "The Final Journey",
      "parts": [
        {
          "title": "Geological Context",
          "ssmlFile": "section10a_final_journey_part1.xml"
        },
        {
          "title": "Cultural Heritage",
          "ssmlFile": "section10b_final_journey_part2.xml"
        }
      ],
      "combineIntoSingleMP3": true
    }
  ]
}
EOF

# Create Section 0: Introduction
cat > iceland_audio_tour/section0_introduction.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      Hi Heather and Keith, welcome to day 3 of your trip! <break time="500ms"/> Today we'll be exploring Iceland's spectacular South Coast, discovering treasures that showcase the raw power of nature's ongoing creation.
    </p>

    <p>
      Our journey takes us from <phoneme alphabet="ipa" ph="sɛlfɔs">Selfoss</phoneme> through an incredible landscape of thundering waterfalls, dramatic black sand beaches, and towering sea stacks. You'll walk behind the cascading waters of <phoneme alphabet="ipa" ph="sɛljalantsfɔs">Seljalandsfoss</phoneme>, feel the raw power of <phoneme alphabet="ipa" ph="skouɣafɔs">Skógafoss</phoneme>, and explore the otherworldly black beaches of <phoneme alphabet="ipa" ph="vɪkʏrfjara">Vikurfjara</phoneme> and <phoneme alphabet="ipa" ph="reɪnɪsfjara">Reynisfjara</phoneme>. We'll end at the majestic <phoneme alphabet="ipa" ph="dɪrhoʊlaɪ">Dyrhólaey</phoneme> peninsula before reaching our cozy accommodation at The Barn.
    </p>

    <p>
      <emphasis level="moderate">
        Before we begin, here are some words from Nobel laureate Halldór Laxness, Iceland's greatest writer, that capture the spirit of this remarkable landscape:
      </emphasis>
    </p>

    <p>
      <prosody rate="90%">
        "The water runs on its way to the sea, with no other thought than to fall and rise, to live the life that has been ordained for it; a raindrop perhaps that fell onto a mountainside a thousand years ago."
      </prosody>
    </p>

    <p>
      Let our adventure begin as we trace the path of Iceland's waters from ancient glacier to powerful waterfall to the vast and turbulent sea.
    </p>
  </prosody>
</speak>
EOF

# Create Section 1a: Leaving Selfoss Part 1
cat > iceland_audio_tour/section1a_leaving_selfoss_part1.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      Good morning, and welcome to one of our planet's most extraordinary geological wonders. <break time="500ms"/> As you leave <phoneme alphabet="ipa" ph="sɛlfɔs">Selfoss</phoneme> behind, you're driving across what might appear to be an ordinary landscape. <break time="300ms"/> But here, beneath your very wheels, lies a profound boundary - the Mid-Atlantic Ridge - where the North American and Eurasian tectonic plates are slowly pulling apart.
    </p>

    <p>
      Look to your left, where the snow-capped <phoneme alphabet="ipa" ph="eɪjafjahtlajœkʏhtl">Eyjafjallajökull</phoneme> stands sentinel over the landscape. Within that gleaming ice cap lies a chamber of molten rock - a reminder that Iceland is, in geological terms, just an infant, born of fire and constantly remaking itself.
    </p>

    <p>
      The flat plains extending toward the ocean represent land in its infancy. When the Viking settlers arrived over a thousand years ago, the coastline stood much closer to those mountains. These Norse settlers, led by figures like Ingólfur Arnarson, established the first permanent settlements in Iceland around <say-as interpret-as="date" format="y">874</say-as>, marking the beginning of Iceland's recorded history.
    </p>
  </prosody>
</speak>
EOF

# Create Section 1b: Leaving Selfoss Part 2
cat > iceland_audio_tour/section1b_leaving_selfoss_part2.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      The farms you see dot a landscape that has been continuously inhabited for nearly <say-as interpret-as="cardinal">1,150</say-as> years – representing one of the world's oldest continuous democracies through the Althing, established in <say-as interpret-as="date" format="y">930</say-as>.
    </p>

    <p>
      The agricultural fields around you sit atop young volcanic soil—remarkably fertile, yet scarcely <say-as interpret-as="cardinal">10,000</say-as> years old. Traditional farming here evolved unique practices to deal with this volatile environment, including transhumance—the seasonal movement of livestock between lowland winter pastures and mountain summer grazing grounds called <phoneme alphabet="ipa" ph="afrehtɪr">afréttir</phoneme>.
    </p>

    <p>
      As you approach the coastal escarpment ahead, you're witnessing what was once an ancient shoreline, carved by Atlantic waves when the sea reached much farther inland. Soon, you'll glimpse your first waterfall - <phoneme alphabet="ipa" ph="sɛljalantsfɔs">Seljalandsfoss</phoneme> - appearing initially as a distant white thread against the green backdrop. Each droplet began its journey atop that glacier you see, perhaps centuries ago, before finding this dramatic shortcut to the sea.
    </p>
  </prosody>
</speak>
EOF

# Create Section 2a: Seljalandsfoss Part 1
cat > iceland_audio_tour/section2a_seljalandsfoss_part1.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      Here at <phoneme alphabet="ipa" ph="sɛljalantsfɔs">Seljalandsfoss</phoneme>, nature has created one of her most enchanting spectacles. This is not merely a waterfall, but a complete liquid curtain cascading <say-as interpret-as="cardinal">60</say-as> meters down an ancient sea cliff.
    </p>

    <p>
      What makes this place truly remarkable is the cave behind it - carved over millennia as water gradually eroded the softer rock layers beneath the harder basalt cap. I invite you to walk the path and experience a perspective that few waterfalls worldwide can match.
    </p>

    <p>
      As you venture behind the falls, observe how the light plays through the falling water, creating ever-shifting patterns as the sun's angle changes. Notice the dark basalt layers in the cliff face. Each represents a different volcanic eruption, laid down like pages in Iceland's geological history book.
    </p>
  </prosody>
</speak>
EOF

# Create Section 2b: Seljalandsfoss Part 2
cat > iceland_audio_tour/section2b_seljalandsfoss_part2.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      In Icelandic folklore, waterfalls like this were believed to be homes to <phoneme alphabet="ipa" ph="hʏldʏfoʊlk">huldufólk</phoneme>—hidden people or elves. These mystical beings occupy a special place in Iceland's cultural heritage, with many Icelanders still respecting their existence today. Construction projects are sometimes rerouted to avoid disturbing large rocks believed to be elf homes.
    </p>

    <p>
      The name '<phoneme alphabet="ipa" ph="sɛljalantsfɔs">Seljalandsfoss</phoneme>' derives from '<phoneme alphabet="ipa" ph="sɛljalant">Seljaland</phoneme>' farm, which has existed here for centuries. In medieval times, this farm would have been considered wealthy due to its reliable water source and relative protection from glacial floods. Farmers would have gathered angelica and other herbs growing in the mist-nourished microhabitat around the falls.
    </p>

    <p>
      The perpetual mist nourishes an astonishing microhabitat of mosses and small ferns that cling to the rock face - life finding opportunity even in this vertical world. Take your time to explore this magnificent natural wonder before continuing your journey eastward toward <phoneme alphabet="ipa" ph="skouɣafɔs">Skógafoss</phoneme>.
    </p>
  </prosody>
</speak>
EOF

# Create Section 3a: Journey to Skógafoss Part 1
cat > iceland_audio_tour/section3a_journey_to_skogafoss_part1.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      As you continue eastward, you're crossing numerous braided rivers - a distinctive feature of glacial landscapes. Unlike the orderly single channels of older river systems, these waterways constantly shift across the plains, carrying glacial sediment from the highlands to the sea.
    </p>

    <p>
      Their milky appearance comes not from pollution but from rock flour - pulverized stone so fine it remains suspended in the water. When sunlight strikes these particles, they scatter the light, creating that distinctive cloudy color you see.
    </p>

    <p>
      The remarkable flatness stretching before you has a name - <phoneme alphabet="ipa" ph="sandʏr">sandur</phoneme> - an outwash plain created by catastrophic glacial floods known as <phoneme alphabet="ipa" ph="jœkʏlhlœʏps">jökulhlaups</phoneme>. During volcanic eruptions beneath the ice caps, vast quantities of meltwater surge forth, carrying everything from fine silt to house-sized boulders.
    </p>
  </prosody>
</speak>
EOF

# Create Section 3b: Journey to Skógafoss Part 2
cat > iceland_audio_tour/section3b_journey_to_skogafoss_part2.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      Before modern bridges, these rivers presented formidable barriers to travelers. The Icelandic sagas tell of heroes who died attempting river crossings, and mail carriers once maintained special horses trained specifically for navigating these treacherous waterways.
    </p>

    <p>
      Notice the small farms with their distinctive architecture. The traditional Icelandic farmhouse, or <phoneme alphabet="ipa" ph="baɪr">baer</phoneme>, evolved to withstand the harsh environment, with thick walls of stone and turf providing excellent insulation.
    </p>

    <p>
      The mountains to your right belong to what geologists call the Eastern Volcanic Zone - the most active part of Iceland where <say-as interpret-as="cardinal">80</say-as>% of historical eruptions have occurred. Just ahead, the silhouette of <phoneme alphabet="ipa" ph="skouɣafɔs">Skógafoss</phoneme> appears - a perfect rectangular curtain of water with over <say-as interpret-as="cardinal">150</say-as> cubic meters of water crashing down every minute.
    </p>
  </prosody>
</speak>
EOF

# Create Section 4a: Skógafoss Part 1
cat > iceland_audio_tour/section4a_skogafoss_part1.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      Behold <phoneme alphabet="ipa" ph="skouɣafɔs">Skógafoss</phoneme> - one of Iceland's most magnificent waterfalls. The sheer volume of water creates an atmosphere that is not merely seen but felt - a constant vibration in the air and a thunderous roar that speaks to something primal within us.
    </p>

    <p>
      The cliff face you see represents that same ancient coastline we've been following, but here the geological story is particularly clear. Look carefully at the rock layers, and you can identify at least twenty distinct lava flows that created this formidable wall - each marking a separate eruption spanning thousands of years.
    </p>

    <p>
      The name <phoneme alphabet="ipa" ph="skouɣafɔs">Skógafoss</phoneme> translates as 'Forest Falls,' though you'll notice little forest remains today. When Norse settlers arrived in the <say-as interpret-as="ordinal">9</say-as> century, birch woodlands covered up to <say-as interpret-as="cardinal">40</say-as>% of Iceland's surface. Within a century, most had been cleared for timber and grazing land.
    </p>
  </prosody>
</speak>
EOF

# Create Section 4b: Skógafoss Part 2
cat > iceland_audio_tour/section4b_skogafoss_part2.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      According to legend, the first Viking settler in this area, <phoneme alphabet="ipa" ph="θrasi θouroulfssɔn">Þrasi Þórólfsson</phoneme>, hid a chest full of gold behind the waterfall. Many have searched for this treasure over the centuries. In the early <say-as interpret-as="ordinal">18</say-as> century, local boys found one end of the chest but could only retrieve its ring handle before the chest disappeared again.
    </p>

    <p>
      In the <phoneme alphabet="ipa" ph="njauls">Njáls</phoneme> Saga, one of Iceland's most famous medieval literary works, characters travel through this region on their way to the Althing, the world's oldest parliamentary assembly. The power and beauty of <phoneme alphabet="ipa" ph="skouɣafɔs">Skógafoss</phoneme> would have been as awe-inspiring to medieval Icelanders as it is to us today.
    </p>

    <p>
      For those feeling adventurous, I encourage you to climb the <say-as interpret-as="cardinal">527</say-as> steps to the top. You'll be following the beginning of the <phoneme alphabet="ipa" ph="fɪmvœrðʏhauls">Fimmvörðuháls</phoneme> trail - a renowned hiking route between the <phoneme alphabet="ipa" ph="eɪjafjahtlajœkʏhtl">Eyjafjallajökull</phoneme> and <phoneme alphabet="ipa" ph="mɪrdalsyœkʏhtl">Mýrdalsjökull</phoneme> glaciers.
    </p>
  </prosody>
</speak>
EOF

# Create Section 5a: Black Desert Road Part 1
cat > iceland_audio_tour/section5a_black_desert_road_part1.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      Our journey now takes us across what appears to be a black desert - a landscape so otherworldly it has served as a training ground for Apollo astronauts and as the filming location for numerous science fiction productions.
    </p>

    <p>
      What appears barren at first glance is actually one of Earth's newest landscapes, still in the earliest stages of ecological succession. The fine black sand beneath the road consists of volcanic glass - basalt that cooled so rapidly it couldn't form crystals. When glacial rivers carry this material to the coast, Atlantic waves grind it into the distinctive black beaches Iceland is famous for.
    </p>

    <p>
      Unlike quartz sand, which may have traveled through multiple geological cycles over hundreds of millions of years, this material is newly minted from the Earth's interior - perhaps less than a century old.
    </p>
  </prosody>
</speak>
EOF

# Create Section 5b: Black Desert Road Part 2
cat > iceland_audio_tour/section5b_black_desert_road_part2.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      To your right looms <phoneme alphabet="ipa" ph="mɪrdalsyœkʏhtl">Mýrdalsjökull</phoneme> glacier, Iceland's fourth largest ice cap. Beneath it slumbers <phoneme alphabet="ipa" ph="katla">Katla</phoneme>, a volcano historically more powerful than neighboring <phoneme alphabet="ipa" ph="eɪjafjahtlajœkʏhtl">Eyjafjallajökull</phoneme>. The last major <phoneme alphabet="ipa" ph="katla">Katla</phoneme> eruption in <say-as interpret-as="date" format="y">1918</say-as> produced enough meltwater to temporarily increase Iceland's surface area.
    </p>

    <p>
      Icelandic sagas and folk tales are rich with references to <phoneme alphabet="ipa" ph="katla">Katla</phoneme>. One legend claims the volcano was named after a female cook named <phoneme alphabet="ipa" ph="katla">Katla</phoneme> who owned magical pants that allowed the wearer to run without tiring. When a farmhand stole these pants, <phoneme alphabet="ipa" ph="katla">Katla</phoneme> pursued him into the glacier where she disappeared forever.
    </p>

    <p>
      Notice how few farms dot this terrain. Unlike the fertile areas west of <phoneme alphabet="ipa" ph="skouɣafɔs">Skógafoss</phoneme>, this region has been repeatedly ravaged by volcanic eruptions and glacial floods, making long-term settlement precarious.
    </p>
  </prosody>
</speak>
EOF

# Create Section 6a: Vikurfjara Part 1
cat > iceland_audio_tour/section6a_vikurfjara_part1.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      Here at <phoneme alphabet="ipa" ph="vɪkʏrfjara">Vikurfjara</phoneme>, we encounter what appears to be an alien landscape - a vastness of black sand stretching toward distant mountains. This shore represents the newest land in Europe, built from materials that were, geologically speaking, only recently molten rock deep beneath the earth.
    </p>

    <p>
      The ferocious surf before you has traveled unimpeded from Greenland or even North America, gathering tremendous energy across thousands of kilometers of open ocean. These waves are among the most dangerous in Iceland, with so-called 'sneaker waves' that can surge unexpectedly far up the beach. Local children are taught from an early age: 'Never turn your back on the Atlantic.'
    </p>
  </prosody>
</speak>
EOF

# Create Section 6b: Vikurfjara Part 2
cat > iceland_audio_tour/section6b_vikurfjara_part2.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      For centuries, Iceland's maritime culture was defined by wooden fishing boats called <phoneme alphabet="ipa" ph="aurabautʏr">árabátur</phoneme> that launched directly from these black beaches. Fishermen relied on intimate knowledge of local conditions, watching for subtle changes in wave patterns indicating dangerous conditions.
    </p>

    <p>
      This seemingly barren environment supports a remarkable food web. Buried in the sand are multitudes of tiny crustaceans feeding on organic matter washed ashore. These in turn attract wading birds like oystercatchers and sandpipers, which probe the wet sand with specialized beaks.
    </p>

    <p>
      The distant sea stacks visible on the horizon - the <phoneme alphabet="ipa" ph="reɪnɪsdraŋɡar">Reynisdrangar</phoneme> - will become increasingly prominent as we continue eastward. According to folk tradition, these are trolls caught in daylight while attempting to drag a ship ashore.
    </p>
  </prosody>
</speak>
EOF

# Create Section 7a: Reynisfjara Part 1
cat > iceland_audio_tour/section7a_reynisfjara_part1.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      <phoneme alphabet="ipa" ph="reɪnɪsfjara">Reynisfjara</phoneme> presents one of Earth's most striking demonstrations of how mathematical principles underpin natural forms. The hexagonal basalt columns before you weren't carved by human hands but formed through a process akin to drying mud. As thick lava flows cooled from the surface downward, the contracting material cracked in patterns that minimized energy - resulting in these remarkably uniform hexagonal pillars.
    </p>

    <p>
      Similar formations exist at the Giant's Causeway in Northern Ireland and on Scotland's Isle of Staffa - not by coincidence, but because they formed from the same volcanic system when these landmasses were positioned much closer together before continental drift pulled them apart.
    </p>
  </prosody>
</speak>
EOF

# Create Section 7b: Reynisfjara Part 2
cat > iceland_audio_tour/section7b_reynisfjara_part2.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      According to Icelandic folklore, the imposing <phoneme alphabet="ipa" ph="reɪnɪsdraŋɡar">Reynisdrangar</phoneme> sea stacks were once trolls attempting to drag a three-masted ship to shore. When dawn broke, the trolls were turned to stone, forever frozen in their labors. This tale exemplifies how early Icelanders made sense of dramatic geological features through storytelling.
    </p>

    <p>
      Look up at the cliff face to observe the nesting sites of numerous seabirds. During summer months, northern fulmars, guillemots, and puffins create bustling aerial colonies here. The puffin - sometimes called the 'sea parrot' for its colorful breeding-season beak - spends most of its life at sea, coming ashore only to breed.
    </p>

    <p>
      The rhythmic crash of waves against these basalt formations creates distinctive resonant frequencies - a natural music that has inspired Icelandic composers throughout history. Halldór Laxness, Iceland's Nobel laureate, wrote that the sound contains 'all the voices of the world, gathered at the edge of a continent.'
    </p>
  </prosody>
</speak>
EOF

# Create Section 8: Final Stretch to Dyrhólaey
cat > iceland_audio_tour/section8_final_stretch_to_dyrholaey.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      As we approach <phoneme alphabet="ipa" ph="dɪrhoʊlaɪ">Dyrhólaey</phoneme>, we're traversing what geologists call a 'glacial outwash plain' - formed when catastrophic meltwater floods carried enormous quantities of volcanic debris toward the ocean. The seemingly random arrangement of rocks scattered across this landscape includes many that were transported here by ice, sometimes from mountains dozens of kilometers distant.
    </p>

    <p>
      This ever-changing terrain provides scientists with a natural laboratory for studying primary succession - the process by which life colonizes new land. First come the pioneering lichens and mosses, gradually breaking down the volcanic rock and creating the first hints of soil.
    </p>

    <p>
      For centuries, Icelanders traveled these coastal routes on horseback using the unique Icelandic horse—a pure breed isolated on the island since Viking times. These horses developed a distinctive gait called <phoneme alphabet="ipa" ph="tœlt">tölt</phoneme>—a smooth four-beat lateral amble that allows comfortable travel over rough terrain.
    </p>

    <p>
      The distant headland now coming into view is <phoneme alphabet="ipa" ph="dɪrhoʊlaɪ">Dyrhólaey</phoneme> - once an island but now connected to the mainland by accumulated sediments. Its name means 'Door Hill Island,' referring to the massive stone arch large enough for boats to pass through.
    </p>
  </prosody>
</speak>
EOF

# Create Section 9a: Dyrhólaey Part 1
cat > iceland_audio_tour/section9a_dyrholaey_part1.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      From this elevated promontory, we gain perhaps the most comprehensive view of Iceland's southern coast - a landscape that epitomizes the phrase 'fire and ice.' The black beaches extending in both directions represent the newest land in Europe, while the glaciers visible inland hold ice that fell as snow centuries ago.
    </p>

    <p>
      The massive stone arch that gives <phoneme alphabet="ipa" ph="dɪrhoʊlaɪ">Dyrhólaey</phoneme> its name demonstrates the relentless power of ocean erosion. Wave action gradually carved a cave into both sides of this headland until they connected, creating this natural bridge. Eventually - perhaps within a few hundred years - the arch will collapse, transforming <phoneme alphabet="ipa" ph="dɪrhoʊlaɪ">Dyrhólaey</phoneme>'s profile forever.
    </p>

    <p>
      This promontory has served as a crucial navigational landmark for sailors since the earliest settlement days. Long before GPS or even lighthouses, Icelandic fishermen navigated by memorizing distinctive coastal features like <phoneme alphabet="ipa" ph="dɪrhoʊlaɪ">Dyrhólaey</phoneme>.
    </p>
  </prosody>
</speak>
EOF

# Create Section 9b: Dyrhólaey Part 2
cat > iceland_audio_tour/section9b_dyrholaey_part2.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      For generations, local families practiced '<phoneme alphabet="ipa" ph="bjarɡfʏɡl">bjargfugl</phoneme>'—the harvesting of seabirds and their eggs from these cliffs. Men would be lowered on ropes to collect eggs, which provided crucial nutrition during the harsh spring months when other food stores ran low.
    </p>

    <p>
      This promontory serves as a crucial nesting site for numerous seabird species. The Atlantic puffin, perhaps Iceland's most photographed bird, excavates meter-long burrows in the soil atop these cliffs. Each pair raises just one chick annually, feeding it small fish carried in their distinctively colorful beaks.
    </p>

    <p>
      The lighthouse visible above was constructed in <say-as interpret-as="date" format="y">1927</say-as> to guide ships around this hazardous headland. Before such navigational aids, these waters claimed countless vessels. Even today, the seabed off this coast holds numerous shipwrecks - a submarine archaeological record of human history intertwined with natural forces.
    </p>
  </prosody>
</speak>
EOF

# Create Section 10a: Final Journey Part 1
cat > iceland_audio_tour/section10a_final_journey_part1.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      As we complete our day's exploration, we've witnessed but a brief moment in Iceland's ongoing geological saga. This island emerged from the Mid-Atlantic Ridge only about <say-as interpret-as="cardinal">20</say-as> million years ago - a mere infant in Earth's <say-as interpret-as="cardinal">4.5</say-as>-billion-year history. Yet within this geological blink of an eye, Iceland has produced some of our planet's most dramatic landscapes.
    </p>

    <p>
      Reflect on how the forces we've observed today - volcanism, glaciation, and erosion - continue to reshape this terrain. The youngest lava flows we've passed are just decades old, while new eruptions may occur at any time. Iceland isn't a finished landscape but rather a work perpetually in progress.
    </p>

    <p>
      The human settlements we've seen represent an extraordinary adaptation to these volatile conditions. When Norse settlers arrived in the <say-as interpret-as="ordinal">9</say-as> century, they encountered a terrain unlike anything in their homeland. Through careful observation and sometimes painful trial and error, they developed a relationship with this land that has sustained communities for over <say-as interpret-as="cardinal">40</say-as> generations.
    </p>
  </prosody>
</speak>
EOF

# Create Section 10b: Final Journey Part 2
cat > iceland_audio_tour/section10b_final_journey_part2.xml << 'EOF'
<speak>
  <prosody rate="96%">
    <p>
      Modern Icelanders maintain profound connections to their heritage even as they embrace contemporary innovation. Old Norse names remain popular, with many families still using patronymic naming systems where children take their father's first name plus 'son' or '<phoneme alphabet="ipa" ph="douhtɪr">dóttir</phoneme>' as their surname.
    </p>

    <p>
      This cultural preservation extends to traditional practices as well. The annual <phoneme alphabet="ipa" ph="rjehtɪr">réttir</phoneme> (autumn sheep roundup) brings entire communities together to collect sheep from mountain pastures where they've grazed freely all summer—a practice essentially unchanged since settlement times.
    </p>

    <p>
      Iceland's literary tradition begins with the medieval sagas but continues through a thriving contemporary publishing industry. The country produces more books per capita than any other nation, and the Christmas Eve tradition of exchanging books and chocolate—<phoneme alphabet="ipa" ph="joulaboukaflouð">Jólabókaflóð</phoneme> or 'Christmas Book Flood'—exemplifies the central role of storytelling in Icelandic culture.
    </p>

    <p>
      As we approach our accommodation at The Barn, we've completed a journey along one of Earth's most remarkable coastlines - where the land itself seems alive, continental plates diverge beneath our feet, and the distinction between ancient and modern history blurs in the face of geological time. Tomorrow we continue into glacier country, but for now, take time to reflect on the extraordinary forces that have shaped the landscapes we've witnessed today.
    </p>
  </prosody>
</speak>
EOF

echo "Iceland audio tour files created successfully in the 'iceland_audio_tour' directory."
