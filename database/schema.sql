CREATE TABLE IF NOT EXISTS shelters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS pets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  age TEXT NOT NULL,
  energy TEXT NOT NULL,
  size TEXT,
  city TEXT NOT NULL,
  image_url TEXT,
  bio TEXT,
  story TEXT,
  tags TEXT,
  status TEXT DEFAULT 'available',
  shelter_id INTEGER,
  FOREIGN KEY (shelter_id) REFERENCES shelters(id)
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pet_id INTEGER NOT NULL,
  user_name TEXT NOT NULL,
  match_type TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO shelters (id, name, city, phone, email) VALUES
  (1, 'Happy Tails Rescue', 'Brooklyn, NY', '(212) 555-0101', 'hello@happytails.org'),
  (2, 'Paw Haven Studio', 'Austin, TX', '(512) 555-0160', 'care@pawhaven.org'),
  (3, 'Little Bark Collective', 'Seattle, WA', '(206) 555-0191', 'adopt@littlebark.org');

INSERT OR IGNORE INTO pets (id, name, type, age, energy, size, city, image_url, bio, story, tags, status, shelter_id) VALUES
  (1, 'Nova', 'Dog', 'Puppy', 'Playful', 'Medium', 'Brooklyn, NY', 'https://source.unsplash.com/featured/900x1200/?puppy,dog,smiling', 'Nova is a bouncy bundle of joy who loves long walks, squeaky toys, and every person she meets.', 'Matched with a couple who wanted a sociable dog for weekend hikes and family dinners.', '["Friendly","Walks","Apartment-ready"]', 'available', 1),
  (2, 'Mochi', 'Cat', 'Young', 'Affectionate', 'Small', 'Austin, TX', 'https://source.unsplash.com/featured/900x1200/?cat,kitten,orange', 'Mochi is gentle, talkative, and happiest curled up on a soft blanket beside her favorite humans.', 'Settled perfectly in a quiet home with a retired couple who wanted a peaceful companion.', '["Lap cat","Indoor","Calm"]', 'available', 2),
  (3, 'Pip', 'Rabbit', 'Adult', 'Calm', 'Small', 'Seattle, WA', 'https://source.unsplash.com/featured/900x1200/?rabbit,bunny', 'Pip enjoys quiet enrichment, fresh greens, and a peaceful routine with gentle pets and lots of attention.', 'Moved into a home with a cozy sunroom and a family that loved calm, curious pets.', '["Gentle","Sweet","Low-maintenance"]', 'available', 3),
  (4, 'Maple', 'Dog', 'Adult', 'Calm', 'Large', 'Denver, CO', 'https://source.unsplash.com/featured/900x1200/?adult-dog,large-dog', 'Maple has a mellow disposition and a loyal heart, perfect for active families.', 'Found her dream home with parents and kids who loved outdoor adventures and steady company.', '["Smart","Leash trained","Family-friendly"]', 'available', 1),
  (5, 'Luna', 'Cat', 'Puppy', 'Playful', 'Small', 'Portland, OR', 'https://source.unsplash.com/featured/900x1200/?kitten,cat,playful', 'Luna is curious, silly, and always ready for a chase game or a sunbeam nap.', 'Adopted by a first-time pet parent who wanted a playful kitten and a gentle teacher.', '["Curious","Toy-lover","Social"]', 'available', 2),
  (6, 'Otis', 'Dog', 'Young', 'Affectionate', 'Medium', 'Chicago, IL', 'https://source.unsplash.com/featured/900x1200/?happy-dog,young-dog', 'Otis thrives on attention and companionship, making him a perfect match for busy homes with lots of love.', 'Bonded instantly with a family who worked from home and wanted a constant cheerful companion.', '["People-loving","Training","Happy-go-lucky"]', 'available', 3),
  (7, 'Bruno', 'German Shepherd', 'Young', 'Playful', 'Large', 'Phoenix, AZ', 'https://source.unsplash.com/featured/900x1200/?german-shepherd,dog', 'Bruno is handsome, loyal, and wonderfully alert, making him a great fit for active owners.', 'Matched with a home that wanted a confident protector and a devoted running partner.', '["Loyal","Smart","Protective"]', 'available', 1),
  (8, 'Sunny', 'Golden Retriever', 'Puppy', 'Affectionate', 'Medium', 'Nashville, TN', 'https://source.unsplash.com/featured/900x1200/?golden-retriever,dog', 'Sunny is a cheerful people-lover who brings warmth to every room and every adventure.', 'Found a loving family with a backyard, kids, and plenty of fetch time.', '["Friendly","Energetic","Family-ready"]', 'available', 2),
  (9, 'Pebble', 'Tortoise', 'Adult', 'Calm', 'Small', 'San Diego, CA', 'https://source.unsplash.com/featured/900x1200/?tortoise,pet-reptile', 'Pebble is mellow, fascinating, and easygoing, perfect for a calm and gentle home environment.', 'Moved into a sunny habitat with a keeper who loved low-key, long-term companions.', '["Gentle","Low-maintenance","Calm"]', 'available', 3),
  (10, 'Coco', 'Dog', 'Adult', 'Calm', 'Medium', 'Miami, FL', 'https://source.unsplash.com/featured/900x1200/?adult-dog,calm-dog', 'Coco is relaxed, affectionate, and happiest when she is near her favorite people.', 'Matched with a family looking for a sweet companion for city walks and quiet evenings.', '["Sweet","Balanced","Easygoing"]', 'available', 1),
  (11, 'Loki', 'Husky', 'Young', 'Playful', 'Large', 'Anchorage, AK', 'https://source.unsplash.com/featured/900x1200/?husky,dog', 'Loki is adventurous, energetic, and happiest when exploring the outdoors with a confident human.', 'Matched with an active home that loved snow walks and long weekend hikes.', '["Adventure-ready","Athletic","Independent"]', 'available', 2),
  (12, 'Poppy', 'Beagle', 'Puppy', 'Affectionate', 'Small', 'Charlotte, NC', 'https://source.unsplash.com/featured/900x1200/?beagle,dog', 'Poppy is curious, cheerful, and endlessly friendly with people and other pets.', 'Found a home full of play, naps, and plenty of sniff-filled adventures.', '["Sweet","Curious","Playful"]', 'available', 3),
  (13, 'Biscuit', 'Labrador', 'Adult', 'Affectionate', 'Large', 'Dallas, TX', 'https://source.unsplash.com/featured/900x1200/?labrador,dog', 'Biscuit is a classic happy-go-lucky companion who loves people, games, and steady affection.', 'Matched with a family that wanted a gentle, social dog to join every outing.', '["Kind","Social","Loyal"]', 'available', 1),
  (14, 'Mango', 'Parrot', 'Young', 'Playful', 'Small', 'Los Angeles, CA', 'https://source.unsplash.com/featured/900x1200/?parrot,bird', 'Mango is bright, social, and full of personality, always ready for interaction and enrichment.', 'Moved into a colorful, engaging home with someone who loved a chatty companion.', '["Bright","Social","Smart"]', 'available', 2),
  (15, 'Khan', 'Central Asian Shepherd', 'Adult', 'Protective', 'Large', 'Denver, CO', 'https://source.unsplash.com/featured/900x1200/?central-asian-shepherd,dog', 'Khan is calm, confident, and deeply loyal, especially in a stable and experienced home.', 'Matched with a guardian who wanted a powerful companion with a strong sense of duty and affection.', '["Protective","Loyal","Confident"]', 'available', 1),
  (16, 'Bolt', 'Boxer', 'Young', 'Playful', 'Large', 'Houston, TX', 'https://source.unsplash.com/featured/900x1200/?boxer,dog', 'Bolt is bouncy, affectionate, and loves to stay close to his people while staying active.', 'Matched with a family that wanted a bright, happy dog with plenty of energy for adventures.', '["Energetic","Friendly","Goofy"]', 'available', 2),
  (17, 'Daisy', 'Corgi', 'Puppy', 'Playful', 'Small', 'Portland, ME', 'https://source.unsplash.com/featured/900x1200/?corgi,dog', 'Daisy is cheerful, curious, and always ready for a quick jog or a sunny nap.', 'Found a home with someone who wanted a compact dog with a big personality.', '["Sunny","Happy","Spirited"]', 'available', 3),
  (18, 'Sage', 'Rottweiler', 'Adult', 'Calm', 'Large', 'Nashville, TN', 'https://source.unsplash.com/featured/900x1200/?rottweiler,dog', 'Sage is steady, loyal, and deeply affectionate once trust is established.', 'Matched with a patient family that valued calm confidence and a devoted companion.', '["Balanced","Watchful","Loyal"]', 'available', 1),
  (19, 'Patch', 'Dachshund', 'Adult', 'Affectionate', 'Small', 'Austin, TX', 'https://source.unsplash.com/featured/900x1200/?dachshund,dog', 'Patch is playful, charming, and happiest when he is near his favorite people.', 'Moved into a home that wanted a bold little buddy with a big heart.', '["Charming","Curious","Cuddly"]', 'available', 2),
  (20, 'Rio', 'Bengal', 'Young', 'Affectionate', 'Medium', 'San Francisco, CA', 'https://source.unsplash.com/featured/900x1200/?bengal-cat,cat', 'Rio is sleek, social, and full of curiosity with a playful streak that never fades.', 'Matched with a home that offered interactive toys and lots of affectionate attention.', '["Social","Playful","Lively"]', 'available', 3);

INSERT OR IGNORE INTO matches (id, pet_id, user_name, match_type) VALUES
  (1, 1, 'Alicia', 'like'),
  (2, 2, 'Jordan', 'superlike'),
  (3, 3, 'Sam', 'like');
