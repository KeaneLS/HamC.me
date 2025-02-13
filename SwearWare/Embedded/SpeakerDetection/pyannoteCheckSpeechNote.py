import os
import requests
from dotenv import load_dotenv
load_dotenv()

def pyannoteCheckSpeechNote(fileName="https://se101.s3.us-east-2.amazonaws.com/swear_context_2024-11-25_21-16-27.wav"):
    AUTH_TOKEN = os.getenv("PYANNOTE_KEY")

    url = "https://api.pyannote.ai/v1/identify"
    # Fixing the headers definition
    payload = {
        "url": f"https://se101.s3.us-east-2.amazonaws.com/{fileName}",
        "numSpeakers": 1,
        "webhook": "https://8c34-129-97-124-166.ngrok-free.app/webhook",
        "voiceprints": [
            {
                "label": "Kevin",
                "voiceprint": "fMSqPfI0Bz7j79a8LAKsvu4kjT3vlxy9m+JPvSNN37xqw+O9zy1ovsYgND5g9rS+aplNPsIER768oDQ9pNcRvurO6D2qUZe9+ppGvVh2Rj7o8Gs+byeWvMLvMT5MEyI+ciyGPhnP4z0wlQ29XEPSPqbbXj6GnEi8BXiYPE28kj6QZrs+MA/8vZ0/gT6unKM7zB2iPnJTLb6cxpo+9qgKvlC27r4Fxm48wIEZOY6tSD1vZIy+/msXPmE4wz06duy+tAfIvfYthD5W4Ag+3JraPfgaYD0elpk9bpkBPkzu5r1PiBE+c1fOvnOfBL/gSzs+1EdcPqkuGD7CdUK+oiI1vZrBt72L1ly8rAS+PPc0L77CoHE+KNg1vvY62zx60KS+x4IAPkiMUL380qA+M3+fPiWZOz8wUt+8c3q7Ph3xsbxD9UI+HIPKu3zcC77N3d89D5jpvSr1pj6BC889+4xlvqrmED5u8x89MjplvrDdVj2xHw2+nWc5PeJqwD5WvGW9lpgIvrxcRj5EJpe+mn8iPigBVL2asLK8JMC2Pkmgzz1UlIM+xuYnPZjw0L5x8v48teFWPgYwJ76dE3o+FzpSPvb6N71s/lu95IZEPuDT/j32/w2+NlSuvJSJqL4NjDA84P08PS1ghb6qw2s9LmLcPAECsj5MktA+P5uuPSNGhj4MI/i7MGw3vUvaZr5iNbm+/5dRPlL+Jz7yApM86asGv4ii6b03Ry6+PxbuPnLtGT2Carw9aDULPqX/1r4i75o+R4ecPk5go7wnfhm9hXZBviaDTT6of9K9HozcPaATBz5dwi2+tF51vZRVXD1Iy8694im7vUZ7tz6o/TA+f1L5vQwG+bxUHRE+AoKWPmkVRb08pfQ9xm9DvdswtL0P60u+Ft5rPrHzQD7ADEc7B5NGPpDtAz77foy+QB+uvTjBqb46jx0+U62SPZVYMD1eHfU9+QzyvD6AYr0IyE49dHwYPn1wFj4Fi6i+pAJKvVBXVb6wbU07oHXwveqSj71FgNQ+Wt6VvkdFQT0U+N68VwYlPYIjTb6scVA+2Hj9PMId5T2lNC6+lppgvVCRlT7gEka9O/m0PGXhLz16jW4+N6iwvIb+HD4Lsvs+en4Mv98KIL4cVOe94301vVJqDTxsYRs9ZhaAvWnkXr17aVw+FIPSvqDIJD8oV8U94ZVZPhxGqzsHQIw9pphqvvPKlz7uz6u7ZM85PjwOvz1fSgi9ogLZPbvbFb7gihi+aD68vXxcdD06ec28ntoVPrv1Jz5uAwm+1VmnvX8twr0B5WK8UqEzOhLquL582J8+2vFcPhWdpr3VQYq+r2LPPizYHT47ZMc95wf1vYK00D3G6/S8Cntovg=="
            },
            {
                "label": "Fletcher",
                "voiceprint": "w3gNvoDIcT4W6Li9kuDtvQRshL5CNAI+k8dDvl6avD3VUyS+HuchvorZUj1692K+/t0hPq0bIbzxSJI9AqO2vILkbzxwiS29mnEAvq5hobzUoma+th9TvvBwpD1IP7292qfTPZFUtb3cSou9AK1DvgfgED5mW40+gphNPr9rDT7STZ+9bpZ8Pq02Fr63xAC+fVoBPuv7wrx8jBs+aOl+vu7p6b2IiYe91KW0PcKbrTwuY/G+zErAPTqGij6GDTS+oxqhPb/YBD/1Lww+zmtBvrK+5ztjG0a+mBoSvs3kdL2s8vu9j3I3viUj5r3mjV6+RxipPbYKu7zcT8S9CH2VvdxXID7IIbY+hM6iPB0OQj5yyG0+rGDzvcAy6ztSAE28NcJTPs5/Gz4M6da9s2pcPnk6x711GXs+vEwgvXZwQ74mhqS9ABXBvYyaoz5iOt47XqTBvbvayz1XSY0+kR/0u4jexbwkbwK+9GzRvAITgz4mH8E+25GdPu5uBLwAMeW+AdAMPmcsDz1AqNm+3jIxPepAZz48gbO8EX0yPXyrmr1gcQU+7t+7PXP3Kb49CKS9GCB9Pq7VlL73eV0+63CgPTk/Sb51WNI9omjMvYLZzb1C7i0+6mapvYtlZL6X9hM+YPsQPpxS5zzXyzq+/uCnviAUIT4upJg+uHx5vq8c3b31fhm+MtCJPRzFcz4utfO9p96BvUauqb1YhQm+vE1nvkb14D2S/UU+wCuSvW6KwT1VGCU+QGp7Pbrm470fB7k9RiI6PtNON77uhS2+Bj23PYin3L20nf48xfuNvmNRTr6FIFi+Sj1qvaI6/T0up7E9Y0oXvhgJY7z8Q7Q9DFmKPXIIH77cSTu+5wKGvgyVgbtYpmo+MkKEvtihVT4yth499tSevDqnWb62PVW++ehRPnDAdz4R5jM9e+qQvhiRXr060is+g9YKPgzxhb0YTqS+ZJaRvUkiAr4PBSO+AtJ2vTpVSj2bJqi+ikgFvu8pBj4zt3Y9SZCpvmx3WDypM4E895EiPri84705RCi+OEngPT4PYj4T2Ty9RFPJPT8V+z3AZgy+H+Q1vc1zkr52gEi9dA6wPVpwwL2gEV29ei0Svg2O0TzrG3g+CgSSvhDuTb5AUee9xp++vUxXAL2UrE8+7wubvYWnwbtkpps9qR1FvRWOuD65KIm+cXamPe2a+z1pdLI9VsuQvAzo7r3xpiM9frc6Pm3orj0KRJw+ZJwnPlR1w73owQY+TlS7PFo+1D6Cl749rqIkPsVnhL0WW16+WllpvZyHGD4vuWG8mXTxva/uOj6QjiM+p6utvbBwcTxSfYe+iz11Pl2GvT0iLCm9UtHLvb3Idz2+jTs+pjq4vA=="
            },
            {
                "label": "Keane",
                "voiceprint": "KlRevfgmPLvgHpo6TZSMvo5zO76LwBm+UvogvpLYVz7qU8K9hs1rPjgGiD7zmZe83hoEP4ZOdD4wnQE+9z69PWQ7+z1oYIQ9ntU5PQXJZz66qLG9rpLePWBbmj58cqw+Z4r2PomxfD5JUYG+wMxFPqpwD772+FM+CqyAPnrByT3Quaq9zXLAvlEvoT19PX8+ms9TPu3Atb1ZyAk+vhAuvQicp741wqi99DSzPgWLlD62Jt6++LSkvhQPzj5uuJG+bl5WPnwa5T6QTaE8pjtAPUbHxj6uynw+sPuvvlcOlT1EWiK+V+NUvqh/qb4+h7S9L5YrPrLKUr6UfUa+A7IoPdYXKjuoBd29wIA/Pnhffr6v6mk91cafPryruTuk68S9isvgPgiQgT1YJnW+PlEgPipg8T1aXlW+8F6UvDYTV75kfIm+mEiEvcjRTj6sHOy9pm10vpUYg72PNyG+6m4TvmiZP7zrPHG+UcmpPb9kPL0gROy8FfEgvpAyZz5O0yk+lI3WPUHH/r2uuce+4Q+Rvf+kcr2MeBu+fisYPtLK6TxQKLS9rgcmPvJbMr4ZPUU+GieyvL8+Cj6nXmQ+fdEwPezkuD2iaVG9UrbZPey2pL4+eoG+JR05PgbRcj15WJo9o0+/vGEi3b0re52++HCivAxBAj7wpdc+8K3NurUH+r2qo5I+Khz8vfr/Tb5Fwia+l42pPRMObz4yUXE9dox2vlD1sz3yXh4+NRVqPiyMob7hvPk8JkyqPv160j6w5Ne+49wuPZP8Lr5hG5+9RoiwPvDZWb6ksj++CM3QPYuXuL4uZt+92uYlvNQLJb2Ysro9SBBzvoCsOzkHItI9JoQ9Pt3FlT6INyA8fO8tPPMJJL2dyqq+p4wFPoskRD6AHE++RNkAvqLrEb+GY2S+AyqaPh6zXL74ldi+n3c+vhl8Ur4K2Ug+J01QPK5FDz4kiMO+7tjAvcMu674XE70+7DIgviyw9T08wIu+qgwMvpCPkz2rafe9TO0MvqbLpTzZW2g+DniNPqRcpbw0lS29aqDtuwKXsT5qzmW9ur8jPpnrPj4Aj4i91czGvrAUqz7wkpG+3IcPPiCYGj4/4lo9wNG4PDDve71UTZM+WcgAv07OAr53nJ49BPZmvoeRUr6HaQE8QjgYvvLiqj3564e8ptNWPQEsBbxMWfC8PN0hvg+HHjt4TaQ8B6bavmtgKj78+5K+uqwzPTPfUb5uaqG9aKjGPu7JDz6cbKY+6CPTvexoUz3Y8m2+w1Z3Pph6/L18mO69zHrEvtyZT742+yW+Ntq6vkKSxL4t5b09gPrrurDEQ75urgm+Vr2CPlIRP764jx2+TpmvPZiRoj40inc+d8KOvQ=="
            }
        ]
    }
    headers = {
        "Authorization": "Bearer sk_40e6f1efe0bf415c83d33d78839da4bd",
        "Content-Type": "application/json"
    }

    response = requests.request("POST", url, json=payload, headers=headers)
    print(payload)
    print(response.text)

pyannoteCheckSpeechNote()