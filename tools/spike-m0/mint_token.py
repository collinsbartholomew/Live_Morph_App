#!/usr/bin/env python3
import re, time, uuid, jwt
from pathlib import Path
env = open('/home/omega/@OMEGA/@PROJECTS/@LIVE_MORPH/Live_Morph_App/backend/.env').read()
secret = re.search(r'^JWT_SECRET=(.*)$', env, re.M).group(1).strip().strip('"').strip("'")
issuer = re.search(r'^JWT_ISSUER=(.*)$', env, re.M).group(1).strip()
now = int(time.time())
claims = {"sub":"59bd5c9d-befc-4e31-903f-da65a3004070",
          "email":"lm_test_1788415206_6333@test.local",
          "typ":"access","iss":issuer,
          "exp":now+7200,"iat":now,"jti":str(uuid.uuid4())}
t = jwt.encode(claims, secret, algorithm="HS256")
out = Path('/home/omega/@OMEGA/@PROJECTS/@LIVE_MORPH/Live_Morph_App/tools/spike-m0/token.txt')
out.write_text(t)
print('minted', len(t), 'chars, exp+7200')
