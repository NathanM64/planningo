// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabaseClient'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  imageData?: string | null
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, subject, message, imageData } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis.' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide.' },
        { status: 400 }
      )
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message,
        image_data: imageData || null,
      })

    if (dbError) {
      console.error('Erreur lors de la sauvegarde dans Supabase:', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde du message.' },
        { status: 500 }
      )
    }

    // Subject labels for email
    const subjectLabels: Record<string, string> = {
      'custom-agenda': 'Demande d\'agenda sur-mesure',
      'question': 'Question générale',
      'bug': 'Signaler un bug',
      'feature': 'Suggestion de fonctionnalité',
      'other': 'Autre',
    }

    const subjectLabel = subjectLabels[subject] || subject

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'Planningo Contact <onboarding@resend.dev>',
        to: 'marimbordes.nathan@gmail.com', // Your email to receive contact messages
        replyTo: email,
        subject: `[Planningo] ${subjectLabel} - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0000EE;">Nouveau message de contact</h2>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nom :</strong> ${name}</p>
              <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Sujet :</strong> ${subjectLabel}</p>
            </div>

            <div style="background: white; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h3 style="margin-top: 0;">Message :</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>

            ${imageData ? `
              <div style="margin-top: 20px;">
                <p><strong>Image jointe :</strong></p>
                <p style="color: #666; font-size: 14px;">Une image a été envoyée avec ce message. Consultez la base de données Supabase pour la visualiser.</p>
              </div>
            ` : ''}

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">

            <p style="color: #666; font-size: 12px;">
              Ce message a été envoyé via le formulaire de contact de Planningo.
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      // Log error but don't fail the request since message is saved in DB
      console.error('Erreur lors de l\'envoi de l\'email:', emailError)

      // Return success anyway because message is in database
      return NextResponse.json({
        success: true,
        warning: 'Message enregistré mais email non envoyé.',
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors du traitement du formulaire de contact:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
