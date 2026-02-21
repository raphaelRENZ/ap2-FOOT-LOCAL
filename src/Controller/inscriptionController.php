<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request; // Pour récupérer les données Postman
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse; // Pour répondre en JSON
use Symfony\Component\Routing\Attribute\Route;

class inscriptionController extends AbstractController
{
    // Route existante pour ton site web (HTML)
    #[Route('/inscription', name: 'app_inscription')]
    public function index(): Response
    {
        return $this->render('inscription/inscription.html.twig');
    }

    // NOUVELLE ROUTE : Pour ton API Postman (JSON)
    // URL : http://localhost:8000/api/inscription
    #[Route('/api/inscription', name: 'api_inscription', methods: ['POST'])]
    public function apiInscription(Request $request): JsonResponse
    {
        // On récupère les données envoyées dans le Body de Postman
        $data = $request->toArray();

        // On simule un succès d'inscription
        return $this->json([
            'status' => 'success',
            'message' => 'Inscription effectuée !',
            'details' => $data // On renvoie ce qu'on a reçu pour vérifier
        ], 201); // Code 201 : Ressource créée
    }
}