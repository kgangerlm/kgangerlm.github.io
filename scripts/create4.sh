#!/bin/bash

# Create directory structure
mkdir -p audio_tour/ssml_files

# Create the JSON file
cat > audio_tour/audio_tour.json << 'JSONFILE'
{
  "title": "Icelandic Road Trip: Glacier Experiences",
  "sections": [
    {
      "id": "day4_intro",
      "title": "Introduction to Glacier Day",
      "ssmlFile": "day4_intro.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 63.4186809,
          "longitude": -19.0060479
        },
        "radius": 500,
        "description": "Starting point at Norðurfoss",
        "approachTriggers": [
          {
            "direction": "north",
            "latitude": 63.4166809,
            "longitude": -19.0060479
          }
        ]
      }
    },
    {
      "id": "fjadrargljufur_canyon",
      "title": "Fjaðrárgljúfur Canyon",
      "parts": [
        {
          "title": "Approaching Fjaðrárgljúfur",
          "ssmlFile": "fjadrargljufur_approach.ssml"
        },
        {
          "title": "Exploring the Canyon",
          "ssmlFile": "fjadrargljufur_explore.ssml"
        }
      ],
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 63.7712,
          "longitude": -18.1728
        },
        "radius": 800,
        "description": "Fjaðrárgljúfur Canyon area",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 63.7712,
            "longitude": -18.1928
          }
        ]
      }
    },
    {
      "id": "skeidara_bridge_monument",
      "title": "Skeiðará Bridge Monument",
      "ssmlFile": "skeidara_bridge.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 63.9780,
          "longitude": -17.0250
        },
        "radius": 500,
        "description": "Skeiðará Bridge Monument area",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 63.9780,
            "longitude": -17.0450
          }
        ]
      }
    },
    {
      "id": "drive_to_skaftafell",
      "title": "Drive to Skaftafell",
      "ssmlFile": "drive_to_skaftafell.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 63.9000,
          "longitude": -17.5000
        },
        "radius": 5000,
        "description": "Road between Fjaðrárgljúfur and Skaftafell",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 63.9000,
            "longitude": -17.6000
          }
        ]
      }
    },
    {
      "id": "svartifoss_hike",
      "title": "Svartifoss Waterfall Hike",
      "parts": [
        {
          "title": "Arrival at Skaftafell",
          "ssmlFile": "skaftafell_arrival.ssml"
        },
        {
          "title": "Hiking to Svartifoss",
          "ssmlFile": "svartifoss_hike.ssml"
        }
      ],
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 64.0283,
          "longitude": -16.9758
        },
        "radius": 800,
        "description": "Skaftafell Visitor Center area",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 64.0283,
            "longitude": -17.0000
          }
        ]
      }
    },
    {
      "id": "glacier_folklore",
      "title": "Icelandic Glacier Folklore",
      "ssmlFile": "glacier_folklore.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 64.0800,
          "longitude": -16.7000
        },
        "radius": 5000,
        "description": "Road between Skaftafell and Jökulsárlón",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 64.0800,
            "longitude": -16.8000
          }
        ]
      }
    },
    {
      "id": "drive_to_jokulsarlon",
      "title": "Drive to Jökulsárlón",
      "ssmlFile": "drive_to_jokulsarlon.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 64.0500,
          "longitude": -16.5000
        },
        "radius": 5000,
        "description": "Road approaching Jökulsárlón",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 64.0500,
            "longitude": -16.6000
          }
        ]
      }
    },
    {
      "id": "jokulsarlon_lagoon",
      "title": "Jökulsárlón Glacier Lagoon",
      "parts": [
        {
          "title": "Arrival at Jökulsárlón",
          "ssmlFile": "jokulsarlon_arrival.ssml"
        },
        {
          "title": "Boat Tour Tips",
          "ssmlFile": "jokulsarlon_boat.ssml"
        }
      ],
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 64.0784,
          "longitude": -16.2306
        },
        "radius": 800,
        "description": "Jökulsárlón Glacier Lagoon area",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 64.0784,
            "longitude": -16.2506
          }
        ]
      }
    },
    {
      "id": "diamond_beach",
      "title": "Diamond Beach",
      "ssmlFile": "diamond_beach.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 64.0776,
          "longitude": -16.2292
        },
        "radius": 500,
        "description": "Diamond Beach area",
        "approachTriggers": [
          {
            "direction": "north",
            "latitude": 64.0750,
            "longitude": -16.2292
          }
        ]
      }
    },
    {
      "id": "fjallajokull_viewpoint",
      "title": "Fjallajökull Glacier Viewpoint",
      "ssmlFile": "fjallajokull_viewpoint.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 64.0830,
          "longitude": -16.3830
        },
        "radius": 600,
        "description": "Fjallajökull Glacier viewing area",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 64.0830,
            "longitude": -16.4030
          }
        ]
      }
    },
    {
      "id": "drive_to_hofn",
      "title": "Drive to Höfn",
      "ssmlFile": "drive_to_hofn.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 64.1500,
          "longitude": -15.7000
        },
        "radius": 5000,
        "description": "Road between Diamond Beach and Höfn",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 64.1500,
            "longitude": -15.8000
          }
        ]
      }
    },
    {
      "id": "southeast_iceland_history",
      "title": "Southeast Iceland History",
      "ssmlFile": "southeast_iceland_history.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 64.2000,
          "longitude": -15.4000
        },
        "radius": 5000,
        "description": "Approaching Höfn",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 64.2000,
            "longitude": -15.5000
          }
        ]
      }
    },
    {
      "id": "hofn_arrival",
      "title": "Arrival in Höfn",
      "ssmlFile": "hofn_arrival.ssml",
      "combineIntoSingleMP3": true,
      "geofence": {
        "center": {
          "latitude": 64.2539,
          "longitude": -15.1999
        },
        "radius": 800,
        "description": "Höfn town area",
        "approachTriggers": [
          {
            "direction": "west",
            "latitude": 64.2539,
            "longitude": -15.2500
          }
        ]
      }
    }
  ]
}
JSONFILE

# Create the SSML files
cat > audio_tour/ssml_files/day4_intro.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>Welcome to day four of your Icelandic adventure, where you'll experience the magnificent ice formations that give this country its name.</s>
    <s>Today's journey takes you from <lang xml:lang="is-is">Norðurfoss</lang> to <lang xml:lang="is-is">Höfn</lang>, through Iceland's glacier country.</s>
  </p>
  <p>
    <s>Ahead lies a day of dramatic contrasts – from deep canyons to massive ice fields, thundering waterfalls to serene glacier lagoons.</s>
    <s>You'll have the chance to get up close to ancient ice during your zodiac boat tour and walk among diamond-like ice chunks on black sand beaches.</s>
  </p>
  <p>
    <s>Did you know that glaciers cover about 11% of Iceland's land mass?</s>
    <s><break time="0.5s"/>Unfortunately, they're receding at an alarming rate due to climate change, with some retreating up to 50 meters per year.</s>
    <s>What you'll see today is a landscape in transition – a rare opportunity to witness both the beauty and fragility of these ice giants.</s>
  </p>
  <p>
    <s>As we begin our drive toward <lang xml:lang="is-is">Fjaðrárgljúfur</lang> Canyon, keep an eye out for the changing landscape around you.</s>
    <s>The road ahead promises numerous wonders of ice and fire.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/fjadrargljufur_approach.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>We're now approaching <lang xml:lang="is-is">Fjaðrárgljúfur</lang> Canyon, which translates to "Feather Canyon" in English.</s>
    <s>Despite its ancient appearance, this remarkable formation is relatively young, carved out at the end of the last Ice Age around 9,000 years ago.</s>
  </p>
  <p>
    <s>As massive glaciers retreated, an enormous flood of meltwater surged through this area, cutting into the soft palagonite bedrock and creating the dramatic 328-foot deep canyon you'll soon see.</s>
  </p>
  <p>
    <s>In recent years, this location gained international fame after appearing in Justin Bieber's music video "I'll Show You" in 2015.</s>
    <s>The resulting tourism boom actually led to temporary closures, allowing the delicate moss-covered walls to recover.</s>
    <s>This is a reminder of how fragile Iceland's unique ecosystems can be.</s>
  </p>
  <p>
    <s>As you prepare to explore, listen for the sound of the <lang xml:lang="is-is">Fjaðrá</lang> river flowing through the canyon below.</s>
    <s>According to local folklore, you might also be in the presence of <lang xml:lang="is-is">huldufólk</lang> or "hidden people" who are said to reside in the nooks and crevices of these dramatic walls.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/fjadrargljufur_explore.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>As you walk along the rim of <lang xml:lang="is-is">Fjaðrárgljúfur</lang> Canyon, take in the serpentine gorge that winds approximately 2 kilometers through the landscape.</s>
    <s>The moss-covered walls create an otherworldly atmosphere, especially when catching the sunlight.</s>
  </p>
  <p>
    <s>The vibrant green moss you see is actually a complex ecosystem in itself.</s>
    <s>These mosses grow extremely slowly in Iceland's harsh climate – just a few millimeters per year – which is why it's vital to stay on the marked paths.</s>
    <s>Some of these moss patches could be hundreds of years old!</s>
  </p>
  <p>
    <s>The multiple viewing platforms offer dramatically different perspectives of the canyon.</s>
    <s>If you're visiting on a clear day, look for rainbows forming in the mist above the river.</s>
    <s>And keep your camera ready – the interplay of light, shadow, and the vibrant colors create perfect photographic opportunities.</s>
  </p>
  <p>
    <s>Before you leave, take a moment to appreciate the power of water in shaping Iceland's landscape.</s>
    <s>Just as this canyon was carved by glacial meltwater, you'll soon see how ice continues to transform this country, creating both destruction and beauty in equal measure.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/skeidara_bridge.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>You're now approaching the remnants of the <lang xml:lang="is-is">Skeiðará</lang> Bridge Monument – a powerful testament to the destructive forces of glacial floods.</s>
    <s>What you see are twisted metal structures displayed alongside the road, preserved as a memorial to one of Iceland's most devastating natural disasters.</s>
  </p>
  <p>
    <s>In November 1996, the <lang xml:lang="is-is">Grímsvötn</lang> volcano erupted beneath the <lang xml:lang="is-is">Vatnajökull</lang> ice cap.</s>
    <s>The eruption melted massive amounts of ice, which accumulated under the glacier before bursting out in a catastrophic flood known as a <lang xml:lang="is-is">jökulhlaup</lang>.</s>
  </p>
  <p>
    <s>This wall of water and ice rushed toward the ocean, carrying icebergs the size of houses.</s>
    <s>The peak flow rate reached an astonishing 45,000 cubic meters per second – nearly equivalent to the Amazon River!</s>
    <s>When it reached this bridge, the force was unstoppable, tearing away and twisting the steel girders like they were made of paper.</s>
  </p>
  <p>
    <s>This monument serves as a humbling reminder of nature's power in Iceland.</s>
    <s>The Ring Road was severed at this point, cutting off eastern Iceland from the rest of the country for weeks.</s>
    <s>Today's modern bridge is designed to allow such floods to pass underneath, but the monument remains to tell this dramatic story.</s>
  </p>
  <p>
    <s>The geological forces you'll see throughout today's journey – from peaceful glacial lagoons to violent floods – all represent different aspects of Iceland's dynamic relationship with ice.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/drive_to_skaftafell.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>As we drive eastward toward Skaftafell, you're traveling through one of Iceland's most volcanically active regions.</s>
    <s>Look to your left for glimpses of <lang xml:lang="is-is">Vatnajökull</lang>, Europe's largest glacier by volume, covering an astonishing 8% of Iceland's total land area.</s>
  </p>
  <p>
    <s>This massive ice cap conceals several active volcanoes beneath it, creating a dynamic environment where fire and ice coexist.</s>
    <s>When these subglacial volcanoes erupt, they can trigger devastating floods called <lang xml:lang="is-is">jökulhlaups</lang> – glacier outburst floods.</s>
  </p>
  <p>
    <s>You might notice the vast gravel plains extending to your right toward the ocean.</s>
    <s>These areas, called <lang xml:lang="is-is">sandur</lang>, were created by centuries of these glacial floods depositing sediment.</s>
    <s>They represent yet another way glaciers shape Iceland's unique terrain.</s>
  </p>
  <p>
    <s>This road we're traveling wasn't completed until the 1970s, as bridges over the powerful glacial rivers presented enormous engineering challenges.</s>
    <s>Before this, the communities in southeast Iceland were remarkably isolated during winter months.</s>
    <s>Skaftafell, where we're heading, was once so remote it was considered its own county with unique customs and even its own accent.</s>
  </p>
  <p>
    <s>As you continue your drive, keep watching the landscape transform around you, and prepare for your next stop at Skaftafell, a lush oasis amid the glacial surroundings.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/skaftafell_arrival.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>Welcome to Skaftafell, a remarkable area within <lang xml:lang="is-is">Vatnajökull</lang> National Park, which is the largest national park in Europe.</s>
    <s>What makes this place special is the surprising contrast between its lush vegetation and the looming ice cap nearby.</s>
  </p>
  <p>
    <s>Skaftafell was once a thriving farm and community so isolated it functioned almost as its own micro-society.</s>
    <s>The area's unique climate – sheltered by mountains and glaciers – creates milder conditions than the surrounding regions, allowing for the birch forests and other vegetation you see around you.</s>
  </p>
  <p>
    <s>The landscape here has been dramatically shaped by eruptions from the nearby <lang xml:lang="is-is">Öræfajökull</lang> volcano, which last erupted in 1727.</s>
    <s>In 1362, it produced the largest tephra eruption in Iceland's history, destroying the local district and killing all inhabitants.</s>
    <s>The area was so devastated it was renamed <lang xml:lang="is-is">Öræfi</lang>, meaning "wasteland."</s>
  </p>
  <p>
    <s>As you prepare for your hike to Svartifoss waterfall, notice the various hiking trails that crisscross this area – they range from easy walks to challenging glacier hikes.</s>
    <s>Your 3-mile round trip to Svartifoss will take you on a moderate uphill climb, offering increasingly spectacular views as you ascend.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/svartifoss_hike.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>As you hike toward <lang xml:lang="is-is">Svartifoss</lang>, which means "Black Falls," you'll gradually ascend about 400 feet through changing landscapes.</s>
    <s>The trail offers excellent views of the surrounding mountains and glacier tongues snaking down from the <lang xml:lang="is-is">Vatnajökull</lang> ice cap.</s>
  </p>
  <p>
    <s>You'll encounter a few smaller waterfalls before reaching the main attraction.</s>
    <s>These include <lang xml:lang="is-is">Hundafoss</lang> (Dog Falls) and <lang xml:lang="is-is">Magnúsarfoss</lang>, each with their own unique character.</s>
  </p>
  <p>
    <s><emphasis>Svartifoss itself is one of Iceland's most distinctive waterfalls.</emphasis></s>
    <s>What makes it special are the dramatic hexagonal basalt columns that frame the waterfall, creating a natural amphitheater.</s>
    <s>These columns formed through a process called columnar jointing, where basaltic lava cooled slowly and contracted, creating these perfect geometric shapes.</s>
  </p>
  <p>
    <s>These remarkable formations directly inspired the design of <lang xml:lang="is-is">Hallgrímskirkja</lang> church in Reykjavík and the National Theatre.</s>
    <s>If you've visited these buildings, you'll immediately recognize the connection.</s>
  </p>
  <p>
    <s>The black basalt columns provide a stark contrast to the white water, especially when sunlight hits the falls.</s>
    <s>For the best photographs, try positioning yourself on the small footbridge that crosses the stream below the falls.</s>
  </p>
  <p>
    <s>As you make your way back, take time to appreciate how the glaciers, volcanoes, and water have worked together over thousands of years to create this remarkable landscape.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/glacier_folklore.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>As we travel through glacier country, it's worth exploring how these massive ice formations have shaped not only Iceland's physical landscape but also its folklore and cultural imagination.</s>
  </p>
  <p>
    <s>In traditional Icelandic folklore, glaciers were often believed to be home to various supernatural beings.</s>
    <s>The most famous are the <lang xml:lang="is-is">jökulþursar</lang> or glacier giants, fearsome trolls who were said to live deep within the ice.</s>
  </p>
  <p>
    <s>One famous local legend tells of <lang xml:lang="is-is">Grýla</lang>, a fearsome giantess who lived in the mountains near <lang xml:lang="is-is">Vatnajökull</lang>.</s>
    <s>She would come down from her icy home during winter to search for misbehaving children to put in her sack.</s>
    <s>Today, she's best known as the mother of the thirteen Yule Lads, Iceland's mischievous Christmas figures.</s>
  </p>
  <p>
    <s>Glaciers were also believed to have distinct personalities and moods.</s>
    <s>When a glacier cracked and groaned, locals would say it was hungry or angry.</s>
    <s>Some communities would leave offerings of milk or food to appease the glacier and prevent calamities like <lang xml:lang="is-is">jökulhlaups</lang>.</s>
  </p>
  <p>
    <s>Even today, many Icelanders maintain a deeply personal relationship with their glaciers.</s>
    <s>When the Ok glacier was officially declared "dead" in 2014 (having lost its status as a glacier due to climate change), Icelanders held a funeral ceremony complete with a memorial plaque.</s>
  </p>
  <p>
    <s>As you continue to observe these ancient ice formations throughout your journey, consider how they've shaped not just the physical landscape but the cultural one as well.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/drive_to_jokulsarlon.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>As we continue east toward <lang xml:lang="is-is">Jökulsárlón</lang> Glacier Lagoon, we're traveling through land that has been dramatically transformed by the retreat of the <lang xml:lang="is-is">Vatnajökull</lang> glacier.</s>
  </p>
  <p>
    <s>Look to your left for stunning views of various glacier tongues descending from the main ice cap.</s>
    <s>These massive rivers of ice have been sculpting this landscape for thousands of years, but they're now retreating at an unprecedented rate due to climate change.</s>
  </p>
  <p>
    <s>Did you know that glacier ice has a distinctive blue color?</s>
    <s>This occurs because the dense ice absorbs all colors of the visible light spectrum except blue, which is transmitted and scattered.</s>
    <s>The older and denser the ice, the bluer it appears.</s>
  </p>
  <p>
    <s>You might notice some unusual monuments along this stretch of road.</s>
    <s>One significant landmark is the remains of the <lang xml:lang="is-is">Skeiðará</lang> Bridge Monument, twisted metal structures displayed as a reminder of the devastating 1996 glacial flood.</s>
    <s>This <lang xml:lang="is-is">jökulhlaup</lang> was triggered by a volcanic eruption under the glacier and carried icebergs the size of houses.</s>
  </p>
  <p>
    <s>The glacier lagoon we're approaching only began forming in the 1930s, when the <lang xml:lang="is-is">Breiðamerkurjökull</lang> glacier started retreating from the ocean.</s>
    <s>What began as a small glacial lake has grown into Iceland's deepest lake at over 200 meters deep, and it continues to expand as the glacier melts.</s>
    <s>We're witnessing a landscape in remarkably rapid transition.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/jokulsarlon_arrival.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s><emphasis>Welcome to one of Iceland's most breathtaking natural wonders – <lang xml:lang="is-is">Jökulsárlón</lang> Glacier Lagoon.</emphasis></s>
    <s>What you're seeing is a relatively recent phenomenon.</s>
    <s>This lagoon didn't exist before the 1930s, when the <lang xml:lang="is-is">Breiðamerkurjökull</lang> glacier began retreating from the Atlantic Ocean.</s>
  </p>
  <p>
    <s>The lagoon has quadrupled in size since the 1970s and continues to grow as the glacier recedes by about 500 feet per year.</s>
    <s>It's now Iceland's deepest lake at more than 248 meters (814 feet) deep in places.</s>
  </p>
  <p>
    <s>Those magnificent icebergs you see floating in the lagoon have broken off the glacier face in a process called calving.</s>
    <s>Some are estimated to be over 1,000 years old, containing compacted snow that fell during the Medieval Period!</s>
    <s>As they float in the mixture of fresh glacier water and seawater, they slowly melt and drift toward the ocean.</s>
  </p>
  <p>
    <s>Keep your eyes open for wildlife.</s>
    <s>Seals can often be spotted swimming among the icebergs or resting on them, and various seabirds including Arctic terns and skuas nest in the area.</s>
  </p>
  <p>
    <s>The otherworldly beauty of <lang xml:lang="is-is">Jökulsárlón</lang> has captured the imagination of filmmakers for decades.</s>
    <s>It has been featured in two James Bond films – <emphasis>A View to a Kill</emphasis> and <emphasis>Die Another Day</emphasis> – as well as <emphasis>Tomb Raider</emphasis> and <emphasis>Batman Begins</emphasis>.</s>
  </p>
  <p>
    <s>Before you set off on your zodiac boat tour, take a moment to absorb this remarkable landscape where ice, water, and light create a constantly changing natural masterpiece.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/jokulsarlon_boat.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>As you prepare for your zodiac boat tour on the lagoon, here are some tips to enhance your experience.</s>
  </p>
  <p>
    <s>First, dress warmly even on sunny days.</s>
    <s>The temperature near the glacier can be significantly colder than elsewhere, and the wind chill factor on the water makes it feel even cooler.</s>
    <s>You'll be provided with a flotation suit, but layer up underneath.</s>
  </p>
  <p>
    <s>During your tour, you'll get much closer to the glacier face and icebergs than possible from shore.</s>
    <s>The zodiac boats can navigate between the icebergs, offering unique perspectives and photo opportunities.</s>
  </p>
  <p>
    <s>Listen for the creaks, groans, and occasional thunderous cracks of the glacier and icebergs.</s>
    <s>These sounds are the voice of ancient ice shifting and changing.</s>
    <s>If you're lucky, you might even witness the dramatic spectacle of ice calving from the glacier face.</s>
  </p>
  <p>
    <s>Did you know that only about 10% of each iceberg is visible above the water?</s>
    <s>The vast majority remains hidden beneath the surface – much like the saying "just the tip of the iceberg."</s>
  </p>
  <p>
    <s>Many of the icebergs contain trapped air bubbles from centuries ago.</s>
    <s>When these bubbles pop, you're literally hearing the release of air from a different era of Earth's history.</s>
  </p>
  <p>
    <s>After your boat tour, be sure to visit Diamond Beach across the road, where some of these icebergs complete their journey to the ocean.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/diamond_beach.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s><emphasis>Welcome to Diamond Beach, one of Iceland's most photogenic locations.</emphasis></s>
    <s>The striking contrast between crystal-clear ice chunks and jet-black volcanic sand creates a natural art installation that's constantly changing.</s>
  </p>
  <p>
    <s>What you're seeing is the final stage in the journey of icebergs from <lang xml:lang="is-is">Jökulsárlón</lang> Glacier Lagoon.</s>
    <s>After floating through the lagoon, they drift through the short river into the ocean, where waves polish them into these glass-like sculptures before washing them ashore.</s>
  </p>
  <p>
    <s>The black sand isn't actually sand in the traditional sense.</s>
    <s>It's crushed lava rock from volcanic eruptions, which gives Iceland's beaches their distinctive color.</s>
    <s>The ice chunks can be hundreds or even a thousand years old, containing ancient air bubbles and sediment that tell stories of Iceland's past climate.</s>
  </p>
  <p>
    <s>Each piece of ice has its own unique shape, transparency, and blue hue depending on its age, density, and the amount of trapped air bubbles.</s>
    <s>The interplay of sunlight through these natural ice sculptures creates an ever-changing display.</s>
  </p>
  <p>
    <s>For the best photographs, try getting low to the ground to capture the ice with the waves or sky as a backdrop.</s>
    <s>If it's sunny, look for rainbows forming in the spray around the ice chunks.</s>
  </p>
  <p>
    <s>While exploring this magical beach, remember to maintain a safe distance from the water.</s>
    <s>The North Atlantic waves are unpredictable and powerful, with dangerous sneaker waves that can surge far up the beach without warning.</s>
    <s>Never turn your back to the ocean, and enjoy this remarkable display from a safe distance.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/fjallajokull_viewpoint.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>Welcome to the <lang xml:lang="is-is">Fjallajökull</lang> Glacier viewpoint, where you can see another of <lang xml:lang="is-is">Vatnajökull's</lang> many impressive outlet glaciers.</s>
    <s>The name literally means "Mountain Glacier" in Icelandic, and it offers yet another perspective on Iceland's diverse ice formations.</s>
  </p>
  <p>
    <s>What makes this glacier distinctive is how it cascades down through the mountains, creating a dramatic icefall that resembles a frozen waterfall.</s>
    <s>This glacier is actually connected to <lang xml:lang="is-is">Öræfajökull</lang>, Iceland's largest active volcano, which last erupted in 1727.</s>
  </p>
  <p>
    <s>The terrain you can see in front of the glacier is a glacial outwash plain, created by meltwater depositing sediments over centuries.</s>
    <s>This flat area was once covered by the glacier itself, giving you a visual indicator of how far it has retreated.</s>
  </p>
  <p>
    <s>Like many of Iceland's glaciers, <lang xml:lang="is-is">Fjallajökull</lang> has been dramatically affected by climate change.</s>
    <s>Scientists study these outlet glaciers carefully, as they serve as indicators of the health of the entire <lang xml:lang="is-is">Vatnajökull</lang> ice cap.</s>
  </p>
  <p>
    <s>As you observe the glacier from this viewpoint, notice the contrast between the white ice, the dark volcanic mountains, and the green vegetation that's beginning to establish itself on the recently exposed land.</s>
    <s>You're witnessing the initial stages of ecological succession – the process by which nature reclaims areas exposed by retreating ice.</s>
  </p>
  <p>
    <s>Before you continue your journey, take a moment to appreciate this magnificent landscape that represents the ongoing dialogue between ice, fire, and time in Iceland's ever-changing environment.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/drive_to_hofn.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>As we continue our journey east toward <lang xml:lang="is-is">Höfn</lang>, we're traveling through one of Iceland's most dramatic coastal landscapes.</s>
    <s>To your left, glacier tongues descend from the mighty <lang xml:lang="is-is">Vatnajökull</lang> ice cap, while to your right, the Atlantic Ocean stretches to the horizon.</s>
  </p>
  <p>
    <s>This narrow strip between mountain and sea has historically made travel in this region extremely difficult.</s>
    <s>Before the Ring Road was completed in the 1970s, this southeastern corner of Iceland was one of the country's most isolated areas.</s>
    <s>During winter storms, communities like <lang xml:lang="is-is">Höfn</lang> could be cut off for weeks.</s>
  </p>
  <p>
    <s>If you look out toward the ocean, you might spot offshore islands including the <lang xml:lang="is-is">Þorlákshöfði</lang> peninsula.</s>
    <s>Local folklore says these islands and rock formations were once trolls caught by daylight while fishing and turned to stone.</s>
  </p>
  <p>
    <s>As we approach <lang xml:lang="is-is">Höfn</lang>, you'll notice the landscape becoming more fertile.</s>
    <s>This area has some of Iceland's most productive farmland, thanks to the rich glacial soil deposited over centuries.</s>
    <s>Watch for local farms raising Icelandic horses and sheep, which have been bred for a thousand years to thrive in this challenging environment.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/southeast_iceland_history.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>As we approach <lang xml:lang="is-is">Höfn</lang>, it's worth reflecting on the unique history of southeast Iceland, a region shaped by isolation and resilience.</s>
  </p>
  <p>
    <s>This area was settled during the initial Norse colonization of Iceland in the 9th and 10th centuries.</s>
    <s>The <lang xml:lang="is-is">Landnámabók</lang>, or Book of Settlements, records several early settlers in this region, including <lang xml:lang="is-is">Hrollaugur</lang>, son of a Norwegian earl, who claimed lands near present-day <lang xml:lang="is-is">Höfn</lang>.</s>
  </p>
  <p>
    <s>Life here has always been defined by the struggle between humans and nature.</s>
    <s>The powerful <lang xml:lang="is-is">Öræfajökull</lang> volcano erupted catastrophically in 1362, completely destroying the district formerly known as <lang xml:lang="is-is">Litlahérað</lang> and killing all its inhabitants.</s>
    <s>This area was subsequently renamed <lang xml:lang="is-is">Öræfi</lang>, meaning "wasteland," a name it still bears today.</s>
  </p>
  <p>
    <s>For centuries, southeastern Iceland remained incredibly isolated.</s>
    <s>With no harbors deep enough for large ships, treacherous glacial rivers without bridges, and massive mountains and glaciers to the north, communities developed unique cultural traditions.</s>
    <s>Even today, some dialectal differences persist in the speech of the older generation.</s>
  </p>
  <p>
    <s>The completion of Iceland's Ring Road in 1974 finally connected this region with the rest of the country, transforming its economy from pure subsistence farming and fishing to include tourism.</s>
    <s>Despite these changes, the people of southeast Iceland maintain a strong connection to their history of resilience in the face of both isolation and powerful natural forces.</s>
  </p>
</speak>
SSMLFILE

cat > audio_tour/ssml_files/hofn_arrival.ssml << 'SSMLFILE'
<?xml version="1.0"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
                 http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
  <p>
    <s>Welcome to <lang xml:lang="is-is">Höfn</lang>, pronounced roughly as "hup" (like "hub" but with a "p" at the end), which means "harbor" in Icelandic.</s>
    <s>This charming fishing town of about 2,000 people is often called the langoustine capital of Iceland.</s>
  </p>
  <p>
    <s>Despite its small size, <lang xml:lang="is-is">Höfn</lang> plays an important role in southeast Iceland as a commercial center, fishing port, and increasingly, as a tourism hub for exploring <lang xml:lang="is-is">Vatnajökull</lang> National Park.</s>
  </p>
  <p>
    <s><lang xml:lang="is-is">Höfn</lang> is actually quite young by Icelandic standards, only established in the early 20th century when a harbor was built here.</s>
    <s>Its importance grew after the road connection to the rest of Iceland was completed in the 1970s, ending centuries of isolation for this corner of the country.</s>
  </p>
  <p>
    <s>If you're looking for dinner tonight, <lang xml:lang="is-is">Höfn</lang> is famous for its langoustine (also called Norway lobster), which flourish in the cold waters offshore.</s>
    <s>These sweet, delicate shellfish are smaller than lobsters but larger than shrimp, and they're a genuine local specialty.</s>
    <s>The town even hosts an annual lobster festival to celebrate this culinary treasure.</s>
  </p>
  <p>
    <s>From various points in town, you can enjoy magnificent views of <lang xml:lang="is-is">Vatnajökull</lang> glacier, which has been your constant companion today.</s>
    <s>The harbor area offers particularly scenic vistas, especially in the evening light.</s>
  </p>
  <p>
    <s>Congratulations on completing day four of your Icelandic adventure!</s>
    <s>Today, you've experienced the power and beauty of Iceland's glaciers from many perspectives – from the ancient ice cap itself to the lagoons, beaches, and landscapes it creates.</s>
    <s>Tomorrow, you'll continue your journey into Iceland's spectacular East Fjords, where mountains meet the sea in dramatic fashion.</s>
  </p>
</speak>
SSMLFILE

echo "Audio tour files have been created successfully in the audio_tour directory."
