// Your original fifteen caption templates; wording preserved.
export function generateOriginalPost(category, description, tone, index = 0) {
            const templates = {
                playful: [
                    `🎉 ${category.toUpperCase()} ALERT! 🎉\n\n${description}\n\nWho's ready for some delicious fun? Tag a friend who needs this in their life! 🔥\n\n#${category.replace(/\s+/g, '')} #FoodieLife #Delicious`,
                    `🌮 Ready to have your mind BLOWN? 🌮\n\n${description}\n\nThis is happiness on a plate! Come get yours before we run out! 😋\n\n#${category.replace(/\s+/g, '')} #YummyInMyTummy #MustTry`,
                    `✨ FOODIE MAGIC HAPPENING NOW! ✨\n\n${description}\n\nSeriously, your taste buds will thank you! Who's joining us? 🙋‍♀️🙋‍♂️\n\n#${category.replace(/\s+/g, '')} #FoodMagic #ComeHungry`
                ],
                bold: [
                    `🚨 ${category.toUpperCase()} IS HERE! 🚨\n\n${description}\n\nDON'T MISS OUT! This is what food dreams are made of! 💥\n\n#${category.replace(/\s+/g, '')} #MustTry #Foodie`,
                    `🔥 BREAKING: Incredible ${category} Available NOW! 🔥\n\n${description}\n\nThis dish is EVERYTHING! Get here before it's gone! ⚡\n\n#${category.replace(/\s+/g, '')} #GameChanger #Incredible`,
                    `💥 ATTENTION FOOD LOVERS! 💥\n\n${description}\n\nThis ${category} is absolutely PHENOMENAL! Don't walk, RUN! 🏃‍♀️💨\n\n#${category.replace(/\s+/g, '')} #Phenomenal #RunDontWalk`
                ],
                classic: [
                    `Introducing our ${category} ✨\n\n${description}\n\nCrafted with care and the finest ingredients. Join us for an unforgettable dining experience.\n\n#${category.replace(/\s+/g, '')} #FineDining #Culinary`,
                    `We're proud to present our ${category} 🍽️\n\n${description}\n\nEvery bite tells a story of culinary excellence. Reserve your table today.\n\n#${category.replace(/\s+/g, '')} #CulinaryExcellence #Gastronomy`,
                    `Discover our exquisite ${category} 🌟\n\n${description}\n\nA testament to our commitment to exceptional cuisine and service.\n\n#${category.replace(/\s+/g, '')} #Exquisite #CulinaryArt`
                ],
                friendly: [
                    `Hey food lovers! 👋\n\n${description}\n\nWe can't wait for you to try this! Come by and let us know what you think! 😊\n\n#${category.replace(/\s+/g, '')} #Community #GreatFood`,
                    `Hello beautiful people! 🤗\n\n${description}\n\nMade with love just for you! Can't wait to see your smiling faces! 💕\n\n#${category.replace(/\s+/g, '')} #MadeWithLove #Family`,
                    `Good morning, sunshine! ☀️\n\n${description}\n\nCome join our food family! We've got something special waiting for you! 🥰\n\n#${category.replace(/\s+/g, '')} #FoodFamily #Special`
                ],
                trendy: [
                    `✨ MOOD: ${category} vibes ✨\n\n${description}\n\nThis is giving us ALL the feels! Who else is obsessed? 🤩\n\n#${category.replace(/\s+/g, '')} #Vibes #Obsessed #Foodstagram`,
                    `📸 Main character energy: ${category} edition 📸\n\n${description}\n\nIt's giving flavor, it's giving amazing, it's giving ICONIC! ✨\n\n#${category.replace(/\s+/g, '')} #MainCharacter #Iconic`,
                    `🔥 POV: You found the perfect ${category} 🔥\n\n${description}\n\nNot me getting emotional over food... actually yes me! 😭✨\n\n#${category.replace(/\s+/g, '')} #POV #Emotional #PerfectFood`
                ]
            };

            const toneTemplates = templates[tone] || templates.friendly;
            const randomTemplate = toneTemplates[index % toneTemplates.length];
            return randomTemplate;
        }

