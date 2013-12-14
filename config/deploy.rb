# config/deploy.rb file
# custom capistrano deply file for simple folder copy to remote server

# application name
set :application, "surfcast"

# remote server
server "surfca.st", :app, :web
 
# user settings
set :user, "wercker"
set :use_sudo, false
set :scm, :none
set :deploy_via, :copy

# folder to be deployed/copied
set :repository,  "dist"

# remote folder
set :deploy_to, '/var/www/capistrano/surfcast'

# ssh settings
ssh_options[:keys] = [ENV["CAP_PRIVATE_KEY"]]
ssh_options[:forward_agent] = true
set :port, 22
 
# disable/overwrite not needed tasks for plain copying
namespace :deploy do

  task :migrate do
    puts "Skipping migrate."
  end

  task :finalize_update do
    puts "Skipping finalize_update."
  end

  task :start do
    puts "Skipping start."
  end

  task :stop do 
    puts "Skipping stop."
  end

  task :restart do
    puts "Skipping restart."
  end
  
end



# Custom tasks for our hosting environment.
namespace :remote do

  desc <<-DESC
    Create a symlink to the application.
  DESC
  task :create_symlink, :roles => :web do

    # print out information
    print "    creating symlink /var/www/nodesurfer -> #{current_path}. Configure your server to use this link.\n"

    # remove existing symlink
    run "rm -f /var/www/cap-nodesurfer/current"

    # create new symlink to latest release (current) inside application root
    run "ln -s #{current_path} /var/www/nodesurfer"

    # remove existing public folder
    run "rm -rf /var/www/nodesurfer/public"

    # rename symlink to 'public' to act as public folder inside application
    run "mv /var/www/nodesurfer/current /var/www/nodesurfer/public"
    
  end

end


# leave only 5 releases
after "deploy", "remote:create_symlink", "deploy:cleanup"